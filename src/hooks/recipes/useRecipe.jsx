import {
	useMaterialContext,
	useProductsContext,
	useRecipesContext,
	useRecipesDispatchContext,
} from '../../context/MainContext';
import { sortArrayNumeric } from '../../lib/common';
import useCurrencyConversion from '../app/useCurrencyConversion';

export default function useRecipe(recipeId = null) {
	const { recipes } = useRecipesContext();
	const { dispatch } = useRecipesDispatchContext();
	const { products } = useProductsContext();
	const { Materials: materials } = useMaterialContext();
	const { convert, defaultCurrency } = useCurrencyConversion();

	if (isNaN(parseInt(recipeId))) {
		return { recipe: null };
	}
	return { recipe: new Recipe(recipes.findById(recipeId), products, materials, convert, dispatch, defaultCurrency) };
} //========================// End of hook

export class Recipe {
	productsClass = null;
	materialsClass = null;
	convert = null;
	defaultCurrency = null;
	dispatch = null;
	recipe = {}; //Store original recipe data in this.
	product = null;
	materials = [];

	//If original yield changes, we can use this ratio to calculate amounts & costs
	yieldRatio = 1;

	//Calculated in constructor
	cost = 0;
	costWithTax = 0;
	unitCost = 0;
	unitCostWithTax = 0;
	costDetails = [];

	constructor(data, productsClass, materialsClass, convert, dispatch, defaultCurrency) {
		if (!data || typeof data !== 'object' || 'recipeId' in data === false) return null;
		if (!productsClass || typeof productsClass !== 'object') return null;
		if (!materialsClass || typeof materialsClass !== 'object') return null;
		//Load external dependencies
		this.productsClass = productsClass;
		this.materialsClass = materialsClass;
		this.convert = convert;
		this.defaultCurrency = defaultCurrency;
		this.dispatch = typeof dispatch === 'function' ? dispatch : null;
		//Save original recipe data
		this.recipe = { ...data };
		//Assign each key-value pair to this obj
		this.loadRecipe(data, this.yieldRatio);
	} //End of constructor

	//Load recipe and materials according to yield ratio
	loadRecipe(data, newYieldRatio = 1) {
		//Validate yield ratio
		const yieldRatio = parseFloat(newYieldRatio);
		if (isNaN(yieldRatio) || yieldRatio < 0) throw new Error(`Invalid yield ratio: ${newYieldRatio}`);
		this.yieldRatio = yieldRatio;

		//Assign recipe values to obj keys
		Object.keys(data).forEach((key) => {
			this[key] = data[key];
		});
		//copy materials not as reference
		this.materials = [...data.materials];
		//Load product
		this.product = this.productsClass.findById(data.productId);
		//Calc base unit
		if (this.product && this.product.isLiquid === true) {
			this.unit = 'L';
		} else {
			this.unit = 'kg';
		}
		//Reset costs to default
		this.cost = 0;
		this.costWithTax = 0;
		this.unitCost = 0;
		this.unitCostWithTax = 0;
		this.costDetails = [];

		//Change values that are affected by yield ratio
		this.yield = data.yield * this.yieldRatio;

		//Load materials with yield ratio in mind
		this.evaluateMaterials();

		//Calculate unit cost
		this.unitCost = this.cost / this.yield;
		this.unitCostWithTax = this.costWithTax / this.yield;
	}

	getDensity() {
		if (!this.product || !this.product.density || isNaN(parseFloat(this.product.density))) return 1;
		return parseFloat(this.product.density);
	}
	isLiquid() {
		if (this.product && this.product?.isLiquid) return true;
		return false;
	}

	//Go through materials array and calculate costs etc...
	evaluateMaterials() {
		//Reset current costs and materials

		//Re-Calculate Materials
		if (!this.materials || !Array.isArray(this.materials) || this.materials.length === 0) return;
		const newMaterials = this.materials.map((item) => {
			//Load corresponding material as a class instance
			const mat = this.materialsClass.findById(item.materialId, true);

			const result = {
				...item,
				name: mat.name,
				density: mat.density,
				//Yield only Affects amount & weight. Cost is calculated using these
				amount: parseFloat(item.amount) * this.yieldRatio,
				weight: parseFloat(item.amount) * parseFloat(mat.density) * this.yieldRatio,
				price: mat.baseUnitPrice,
				priceWithTax: mat.baseUnitPriceWithTax,
				tax: mat.tax,
				currency: mat.currency,
				localPrice: this.convert(mat.baseUnitPrice, mat.currency)?.amount,
				localPriceWithTax: this.convert(mat.baseUnitPriceWithTax, mat.currency)?.amount,
				cost: 0,
			};
			result.cost = result.localPriceWithTax * result.amount;

			//Add to cost
			this.addCost(mat.materialId, result.localPrice, result.localPriceWithTax, result.amount, result.tax);
			return result;
		});

		this.materials = newMaterials;
	}

	//Add a materials cost to this recipes details
	addCost(materialId, localPrice, localPriceWithTax, amount, taxPercentage) {
		if (isNaN(localPrice) || isNaN(localPriceWithTax) || isNaN(amount) || !amount) return;
		const materialCost = localPrice * amount;
		const materialCostWithTax = localPriceWithTax * amount;
		const costDetails = {
			materialId,
			amount: materialCost,
			tax: taxPercentage,
			amountWithTax: materialCostWithTax,
			totalTax: materialCostWithTax - materialCost,
		};

		this.cost += costDetails.amount;
		this.costWithTax += costDetails.amountWithTax;
		this.costDetails.push(costDetails);
	}

	//Analyze cost per tax percentage
	getTaxCosts() {
		return this.costDetails.reduce(
			(accumulator, current) => {
				//Extract tax percentage and total tax amount for this material
				const { tax, totalTax } = current;
				//Add it to total
				accumulator.total += totalTax;
				//If this tax percentage is already in the obj, add the amount to it
				if (tax in accumulator) {
					accumulator[tax] += totalTax;
					return accumulator;
				} else {
					return { ...accumulator, [tax]: totalTax };
				}
			},
			{ total: 0 }
		);
	}

	getTaxesArray() {
		return this.costDetails.reduce((accumulator, current) => {
			//Extract tax percentage and total tax amount for this material
			const { tax, totalTax } = current;

			let allTaxes = [...accumulator];
			//Find old tax data
			if (accumulator.find((taxData) => taxData.percent === tax)) {
				//There already is an item with the same tax percentage. Add this tax amount to that
				allTaxes.map((taxItem) => {
					if (taxItem.percent !== tax) return taxItem; //This is other tax percentage item
					return { percent: tax, amount: taxItem.amount + totalTax };
				});
			} else {
				//This tax percentage is new to the array
				allTaxes.push({ percent: tax, amount: totalTax });
			}
			//Sort tax array
			allTaxes = sortArrayNumeric(allTaxes, 'percent', true);

			return allTaxes;
		}, []);
	}

	//A new yield value is given. Calculate ratio
	changeRecipeYield(newYield = 0) {
		if (!this.recipe.yield) throw new Error('Invalid recipe data');
		newYield = parseFloat(newYield);
		let ratio = 1;
		if (isNaN(newYield) === false && newYield > 0) {
			ratio = newYield / this.recipe.yield; //Get ratio using original yield
		}
		//re-eval the recipe
		this.loadRecipe(this.recipe, ratio);
		return this;
	}

	resetRecipeYield() {
		this.loadRecipe(this.recipe, 1); //Load original data with ratio 1
		return this;
	}

	getLatestUnitCost(field = null) {
		if (!this.recipe.unitCosts || !Array.isArray(this.recipe.unitCosts) || this.recipe.unitCosts.length === 0) {
			//Cant find cost data yet. If available, return current object's data
			if (field === 'cost') return this.unitCost;
			if (field === 'costWithTax') return this.unitCostWithTax;
			return null;
		}
		//First element will be the newest cost
		const result = this.recipe.unitCosts[0];

		if (field in result) return result[field];
		return result;
	}

	saveUnitCost() {
		if (typeof this.dispatch !== 'function') return;
		//Get the last saved unit cost
		const oldCost = this.getLatestUnitCost();
		

		//Generate current cost
		const newCost = {
			recipeId: this.recipeId,
			date: Date.now(),
			cost: this.unitCost,
			costWithTax: this.unitCostWithTax,
		};

		//Compare new and old cost
		if (
			oldCost &&
			Math.abs(oldCost.cost - newCost.cost) <= 0.01 &&
			Math.abs(oldCost.costWithTax - newCost.costWithTax) <= 0.01
		) {
			//Old and new costs are basically the same. No need to save
			return;
		}

		//Add new cost
		this.dispatch({ type: 'addUnitCost', payload: newCost });
	}

	getCostChangePercent() {
		//This function requires at least 2 cost data
		if (!this.recipe.unitCosts || !Array.isArray(this.recipe.unitCosts) || this.recipe.unitCosts.length <= 1) return 0;
		const current = this.recipe.unitCosts[0];
		const previous = this.recipe.unitCosts[1];
		if (!current || !previous || 'cost' in current === false || 'cost' in previous === false) return 0;

		//calculate difference
		const delta = Math.abs(current.cost - previous.cost);
		if (isNaN(delta) || delta <= 0.01) return 0;
		const percent = Math.round((delta / previous.cost) * 10000) / 100;

		return current.cost > previous.cost ? percent : -percent;
	}

	getCostDetailsForTable() {
		return {
			total: this.cost,
			totalWithTax: this.costWithTax,
			totalTax: this.costWithTax - this.cost,
			tax: this.getTaxesArray(),
		};
	}

	/*
	{
    "unit": "pcs",
    "name": "Nice Item",
    "price": 4.2,
    "tax": 18,
    "quantity": 1,
    "currency": "USD",
    "amount": 61.32
  },
	*/
	getMaterialsForTable() {
		//Mutate materials for costTable requirements
		return this.materials.map((item) => {
			const newItem = {
				id: item.materialId,
				unit: item.unit,
				name: item.name,
				price: parseFloat(item.price),
				tax: parseFloat(item.tax),
				quantity: parseFloat(item.amount),
				currency: item.currency,
				amount: null,
			};
			//Validate
			if (isNaN(newItem.price)) newItem.price = 0;
			if (isNaN(newItem.tax)) newItem.tax = 0;
			if (isNaN(newItem.quantity)) newItem.quantity = 0;
			//Calculate amount
			newItem.amount = newItem.price > 0 && newItem.quantity > 0 ? newItem.price * newItem.quantity : 0;
			//Conversion
			if (this.defaultCurrency !== newItem.currency) {
				const { amount } = this.convert(newItem.amount, newItem.currency, this.defaultCurrency);
				//replace converted value
				if (isNaN(amount) === false) newItem.amount = amount;
			}
			return newItem;
		});
	}
}
