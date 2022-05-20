import { useContext } from 'react';
import { ProductsContext } from '.';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import Product from './product';
import { validate } from 'uuid';

/**
 * Use only this hook to access products context
 */
export default function useProducts() {
	const productsState = useContext(ProductsContext);

	class Products {
		//Product instances array
		data = [];
		/**
		 * Collection of current Product's
		 */
		constructor() {
			this.data = productsState.map((item) => {
				return new Product(item);
			});
		}

		/**
		 * Current product count
		 * @returns {number}
		 */
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
			if (!validate(productId)) return null;
			return this.data.find((item) => item.productId === productId);
		}

		/**
		 * Generate data for new/edit product form.
		 * @param {*} param0 productId if this is edit form, name for default localized name
		 * @returns
		 */
		generateFormInitialState({ productId = null } = {}) {
			//Generate default data using static data from Product class
			let result = {};
			Object.keys(Product.fields).forEach((key) => {
				if (Product.fields[key].formField === true) {
					result[key] = Product.fields[key].default;
				}
			});

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
	} //EOC

	//Initialize products
	const products = new Products();

	//Export
	return { products };
}
