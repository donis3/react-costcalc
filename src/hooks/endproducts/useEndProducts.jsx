import { useEffect, useReducer } from 'react';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import useStorageRepo from '../common/useStorageRepo';
import usePackages from '../packages/usePackages';
import useRecipes from '../recipes/useRecipes';
import endProductsReducer from './endProductsReducer';

export default function useEndProducts() {
	//Load local storage for this repo
	const [endProductsRepo, setEndProductsRepo] = useStorageRepo('application', 'endproducts', []);
	//Initialize state using local storage data
	const [endProductsState, dispatch] = useReducer(endProductsReducer, endProductsRepo);
	//Whenever state changes, save it to local storage repo
	useEffect(() => {
		calculateProductCosts(endProducts.getAllSorted(), dispatch);
		setEndProductsRepo(endProductsState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endProductsState]);

	//Load external dependencies to EndProduct item statically
	const { recipes } = useRecipes();
	const [packages] = usePackages();
	EndProduct.loadDependencies({
		recipes: recipes.getAllSorted(),
		packages: packages.getAllSorted(),
		endProducts: endProductsState,
	});

	//All products class
	const endProducts = {
		data: endProductsState,
		//Attach to export object
		getAllSorted: function ({ field = 'name', asc = true } = {}) {
			if (typeof asc !== 'boolean') asc = true;
			//Convert data to EndProduct instances
			const endProductsArray = this.data.map((item) => new EndProduct(item.endId));

			//Sort and return
			if (['name', 'notes', 'commercialName', 'recipeName', 'packageName'].includes(field)) {
				return sortArrayAlphabetic(endProductsArray, field, asc);
			} else if (['endId', 'recipeId', 'packageId'].includes(field)) {
				return sortArrayNumeric(endProductsArray, field, asc);
			} else {
				return endProductsArray;
			}
		},
		//Attach to export object
		findById: function (endId = null) {
			endId = parseInt(endId);
			if (isNaN(endId)) return null;
			const result = this.data.find((item) => item.endId === endId);

			if (!result) return null;
			return result;
		},
	}; //EOC

	//Calculate each products cost and save if needed
	function calculateProductCosts(products = null, dispatch = null) {
		if (!Array.isArray(products) || products.length === 0) return;
		if (!dispatch || typeof dispatch !== 'function') return;
		//Reduce products array and create an array with endId and costs
		const productCostsArray = products.reduce((accumulator, current) => {
			const costOfProduct = calculateCost(current);
			// console.log(current.name, costOfProduct);
			const productData = { endId: current.endId, ...costOfProduct };
			//Return product id and cost information for dispatch
			return [...accumulator, productData];
		}, []);
		//Dispatch costs
		dispatch({ type: 'productCosts', payload: productCostsArray });
	}

	//Calculate cost data for single product
	function calculateCost(product = null) {
		if (isNaN(parseInt(product?.endId))) return null;

		let quantity = 1;

		const costData = {
			recipeCost: 0,
			recipeTax: 0,
			packageCost: 0,
			packageTax: 0,
			total: 0,
			totalWithTax: 0,
		};
		//Find package data
		if (product.package && 'cost' in product.package) {
			let { packageCapacity, cost, tax } = product.package;
			packageCapacity = parseFloat(packageCapacity);
			cost = parseFloat(cost);
			tax = parseFloat(tax);
			if (isNaN(packageCapacity) === false) quantity = packageCapacity;
			if (isNaN(cost) === false) costData.packageCost = cost;
			if (isNaN(tax) === false) costData.packageTax = tax;
		}

		//Find unit cost for this recipe
		if (product.recipe && Array.isArray(product.recipe.unitCosts) && product.recipe.unitCosts.length > 0) {
			let recipeUnitCost = { ...product.recipe.unitCosts[0] };
			let { cost, costWithTax } = recipeUnitCost;
			cost = parseFloat(cost);
			costWithTax = parseFloat(costWithTax);
			if (isNaN(cost) === false) costData.recipeCost = quantity * cost;
			if (isNaN(costWithTax) === false) costData.recipeTax = quantity * (costWithTax - cost);
		}

		costData.total = costData.recipeCost + costData.packageCost;
		costData.totalWithTax = costData.total + costData.recipeTax + costData.packageTax;
		return costData;
	}

	//EXPORTS
	return [endProducts, dispatch];
}

/**
 * Single End product object
 */
class EndProduct {
	static loadDependencies = function ({ recipes, packages, endProducts }) {
		//Clone data
		if (Array.isArray(recipes)) {
			this.recipes = recipes.map((item) => {
				return { ...item, unitCosts: [...item.unitCosts] }; //Deep copy
			});
		}
		if (Array.isArray(packages)) {
			this.packages = [...packages];
		}
		if (Array.isArray(endProducts)) {
			this.endProducts = endProducts;
		}
	};
	//Dependencies as static arrays
	static recipes = [];
	static packages = [];
	static endProducts = [];

	//Instanced props
	data = null;
	recipe = null;
	package = null;
	endId = null;

	//Calculated Props
	recipeName = null;
	packageName = null;

	//Constructor
	constructor(endId = null) {
		//Check end id
		endId = parseInt(endId);
		if (isNaN(endId)) return null;
		this.endId = endId;

		//Load
		const endProduct = EndProduct.endProducts.find((item) => item.endId === endId);
		if (!endProduct) return null;
		this.data = { ...endProduct }; //Copy data as new obj
		//Copy each key as instance property
		Object.keys(endProduct).forEach((key) => (this[key] = endProduct[key]));
		//Find related recipe
		const recipe = EndProduct.recipes.find((item) => item.recipeId === this.recipeId);
		const pack = EndProduct.packages.find((item) => item.packageId === this.packageId);
		if (recipe) {
			this.recipe = recipe;
			this.recipeName = recipe.name;
		}
		if (pack) {
			this.package = pack;
			this.packageName = pack.name;
		}
	}

	//Getters
	get isLiquid() {
		return this.recipe ? this.recipe.isLiquid : false;
	}

	get productType() {
		return this.recipe && this.recipe.isLiquid === true ? 'liquid' : 'solid';
	}

	getCost(withTax = true) {
		if (this.cost && 'total' in this.cost && 'totalWithTax' in this.cost) {
			return withTax ? parseFloat(this.cost.totalWithTax) : parseFloat(this.cost.total);
		}
		return 0;
	}
}
