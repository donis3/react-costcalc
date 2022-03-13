import { useMaterialContext, useProductsContext, useRecipesContext } from '../../context/MainContext';
import useCurrencyConversion from '../app/useCurrencyConversion';

export default function useRecipe(recipeId) {
	const { recipes } = useRecipesContext();
	const { products } = useProductsContext();
	const { Materials: materials } = useMaterialContext();
	const { convert } = useCurrencyConversion();

	return { recipe: new Recipe(recipes.findById(recipeId), products, materials, convert) };
} //========================// End of hook

class Recipe {
	productsClass = null;
	materialsClass = null;
	convert = null;
	recipe = {};
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

	constructor(data, productsClass, materialsClass, convert) {
		if (!data || typeof data !== 'object' || 'recipeId' in data === false) return null;
		if (!productsClass || typeof productsClass !== 'object') return null;
		if (!materialsClass || typeof materialsClass !== 'object') return null;
		//Load external dependencies
		this.productsClass = productsClass;
		this.materialsClass = materialsClass;
		this.convert = convert;
		//Save original recipe data
		this.recipe = { ...data };
		//Assign each key-value pair to this obj
		this.loadRecipe(data, this.yieldRatio);
	} //End of constructor

	//Load recipe and materials according to yield ratio
	loadRecipe(data, yieldRatio = 1) {
		//Validate yield ratio
		yieldRatio = parseFloat(yieldRatio);
		if (isNaN(yieldRatio) || yieldRatio < 0) throw new Error('Invalid yield ratio');
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
		//Change values that are affected by yield ratio
		this.yield = data.yield * this.yieldRatio;

		//Load materials with yield ratio in mind
		this.evaluateMaterials();

		//Calculate unit cost
		this.unitCost = this.cost / this.yield;
		this.unitCostWithTax = this.costWithTax / this.yield;
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

	changeRecipeYield(newYield = 0) {
		newYield = parseFloat(newYield);
		if (isNaN(newYield) || newYield < 0 || newYield === this.yield) return null;
		//Calculate ratio
		const ratio = newYield / this.yield;
		//re-eval the recipe
		this.loadRecipe(this.recipe, ratio);
		return this;
	}

	resetRecipeYield() {
		this.loadRecipe(this.recipe, 1);
		return this;
	}
}
