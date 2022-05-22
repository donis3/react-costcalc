import { validate as isUuid } from 'uuid';
/**
 * Single End product object
 */
export default class EndProduct {
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

	//cost fields for sorting. Actual cost data is in this.cost object
	totalCostWithTax = 0;
	totalCost = 0;

	//Constructor
	constructor(endId = null) {
		//Check end id
		if (!isUuid(endId)) return null;
		this.endId = endId;

		//Load from static repo
		const endProduct = EndProduct.endProducts.find((item) => item.endId === endId);
		if (!endProduct) return null;
		this.data = JSON.parse(JSON.stringify(endProduct)); //Copy data as new obj
		//Copy each key as instance property
		Object.keys(this.data).forEach((key) => (this[key] = this.data[key]));
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
		if (this.cost && 'totalWithTax' in this.cost) {
			this.totalCostWithTax = parseFloat(this.cost.totalWithTax);
			this.totalCost = parseFloat(this.cost.total);
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

	getWeight() {
		//Get density
		let density = NaN;
		if (this.recipe && this.recipe.isLiquid === true && this.recipe.density) {
			density = parseFloat(this.recipe.density);
		}
		if (isNaN(density)) density = 1;

		//Get volume
		let volume = NaN;
		if (this.package && this.package.packageCapacity) {
			volume = parseFloat(this.package.packageCapacity);
		}
		if (isNaN(volume)) volume = 1;

		//Get Weight
		return volume * density;
	}
}
