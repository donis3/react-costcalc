import { useEffect, useReducer } from 'react';

import { getMaxInArray, sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import useConfig from '../app/useConfig';
import useStorageRepo from '../common/useStorageRepo';
import productsReducer from './productsReducer';

export default function useProducts() {
	//Repo for local storage
	const [productsRepo, setProductsRepo] = useStorageRepo('application', 'products', []);
	//Reducer for react state
	const [productsState, dispatch] = useReducer(productsReducer, productsRepo);

	const config = useConfig();
	const defaultCurrency = config.getDefaultCurrency(true);

	useEffect(() => {
		setProductsRepo(productsState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productsState]);

	class Products {
		data = [];
		constructor() {
			this.data = productsState.map((item) => {
				return new Product(item, defaultCurrency);
			});
		}

		count() {
			return Array.isArray(this.data) ? this.data.length : 0;
		}

		/**
		 * Get All products sorted by field
		 * @param {*} param0
		 * @returns
		 */
		getAllSorted({ field = null, asc = true } = {}) {
			if (field && Product.fieldType(field) === 'numeric') {
				//Numeric Sort
				return sortArrayNumeric(this.data, field, asc);
			} else if (field && Product.fieldType(field) === 'string') {
				//String Sort
				return sortArrayAlphabetic(this.data, field, asc);
			}
			//Return unsorted
			return this.data ? this.data : [];
		}

		getDefaultProduct() {
			if (this.data && Array.isArray(this.data) && this.data.length > 0) return this.data[0];
			return null;
		}

		/**
		 * Get single product by its id
		 * @param {*} productId
		 * @returns
		 */
		findById(productId = null) {
			if (productId === null) return null;
			productId = parseInt(productId);
			return this.data.find((item) => item.productId === productId);
		}

		/**
		 * Generate data for new/edit product form.
		 * @param {*} param0 productId if this is edit form, name for default localized name
		 * @returns
		 */
		generateFormInitialState({ productId = null, name = 'Default Product Name' } = {}) {
			//Generate default data
			let result = {};
			Object.keys(Product.fields).forEach((key) => {
				if (Product.fields[key].formField === true) {
					result[key] = Product.fields[key].default;
				}
			});
			if (name && typeof name === 'string') result.name = name;
			result.productId = this.nextId();

			//If being loaded from an existing product
			if (productId !== null && this.findById(productId)) {
				const product = this.findById(productId);
				Object.keys(product).forEach((key) => {
					if (key in result) {
						result[key] = product[key]; //Override result
					}
				});
			}

			return result;
		}

		nextId() {
			if (Array.isArray(this.data) && this.data.length > 0) {
				return getMaxInArray(this.data, 'productId', false) + 1;
			} else {
				return 0;
			}
		}
	}

	const products = new Products();

	return {
		products,
		dispatchProducts: dispatch,
	};
} //End of hook

//==================| Single Product Class =====================//

class Product {
	/**
	 * Static Data and Methods
	 */
	static fields = {
		productId: { type: 'numeric', default: 0, formField: true },
		code: { type: 'string', default: '', formField: true },
		name: { type: 'string', default: '', formField: true },
		isLiquid: { type: 'boolean', default: true, formField: true },
		density: { type: 'numeric', default: 1, formField: true },
		production: { type: 'numeric', default: 0, formField: true },
		costHistory: { type: 'array', default: [], formField: false },
	};
	static defaultProductData(overrideData = null, exclude = []) {
		if (exclude && Array.isArray(exclude) === false) {
			if (typeof exclude === 'string') {
				exclude = [exclude];
			} else {
				exclude = [];
			}
		}
		let result = {};
		Object.keys(Product.fields).forEach((key) => {
			//Skip excluded
			if (exclude.includes(key)) return;
			if (overrideData && key in overrideData) {
				result[key] = overrideData[key];
			} else {
				result[key] = Product.fields[key].default;
			}
		});

		return result;
	}
	static fieldType(field = null) {
		if (field && field in Product.fields) {
			return Product.fields[field].type;
		}
	}

	/**
	 * Instance Properties and Methods
	 */
	//Default product data
	product = null;
	defaultCurrency = null;

	constructor(data = null, defaultCurrency = null) {
		//Data Check
		if (!data || typeof data !== 'object' || data?.productId === undefined) return;
		//Put data in product if key exists in fields static prop
		Object.keys(data).forEach((key) => {
			if (key in Product.fields) {
				this[key] = data[key];
			}
		});
		//Save original data
		this.product = { ...data };

		if (defaultCurrency) this.defaultCurrency = defaultCurrency;
	}

	//Dynamic Getters
	get cost() {
		if (!this.product || !this?.costHistory || Array.isArray(this.costHistory) === false) return 0;
		const costObj = this.costHistory[0];
		if (costObj && 'cost' in costObj && 'currency' in costObj && isNaN(parseFloat(costObj.cost)) === false) {
			return parseFloat(costObj.cost);
		}
		return 0;
	}

	get previousCost() {
		if (!this.product || !this?.costHistory || Array.isArray(this.costHistory) === false) return 0;
		//Get current cost
		const currentCost = this.cost;
		//Not enough data for previous cost
		if (this.costHistory.length < 2) return currentCost;
		//Previous cost is the second data
		const costObj = this.costHistory[1];
		//return it if its valid
		if (costObj && 'cost' in costObj && 'currency' in costObj && isNaN(parseFloat(costObj.cost)) === false) {
			return parseFloat(costObj.cost);
		}
		//return fallback
		return currentCost;
	}

	/**
	 * Return styled cost. With conditional classes if it has gone down or up
	 * @param {*} param0
	 */
	getCostWithStyle() {
		const result = { cost: 0, previous: 0, change: 0 };
		const currentCost = Math.abs(parseFloat(this.cost));
		const previousCost = Math.abs(parseFloat(this.previousCost));
		//Special conditions
		if (isNaN(currentCost) || currentCost === 0) return result;
		if (isNaN(previousCost) || previousCost === 0) return { ...result, cost: currentCost };
		//Calc difference
		const diff = currentCost - previousCost;
		const percentage = Math.round((diff / previousCost) * 1000) / 10; // % value rounded with 1 decimal place
		return { ...result, cost: currentCost, change: percentage, previous: previousCost, currency: this.defaultCurrency };
	}

	get productionMass() {
		if (this.isLiquid === false) return this.production;
		if (this.density > 0) {
			return this.production * this.density;
		} else {
			return 0;
		}
	}
}
