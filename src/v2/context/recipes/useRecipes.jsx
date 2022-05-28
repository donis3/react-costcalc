import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { validate as isUuid } from 'uuid';
import { RecipesContext } from '.';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import useProducts from '../products/useProducts';

/**
 * Use only this hook to access products context
 */
export default function useRecipes() {
	const recipesState = useContext(RecipesContext);
	const { products } = useProducts();
	const { t } = useTranslation('pages/recipes');

	/**
	 * Find a recipe by its uuid
	 * @param {string} recipeId uuidv4 id string
	 * @returns {object} recipe object
	 */
	const findById = (recipeId = null) => {
		if (!isUuid(recipeId)) return;
		const result = recipesState.find((item) => item.recipeId === recipeId);
		return result;
	};

	//Create array including product names and units
	const getAll = () => {
		if (!recipesState || recipesState.length === 0) return [];
		const result = recipesState.map((item) => {
			//Find product
			const product = products.findById(item.productId);
			if (!product) {
				console.log(`Couldn't find requested product for this recipe. ID: ${item.productId}`);
				return {
					...item,
					unit: 'kg',
					product: t('error.error'),
					isLiquid: false,
					density: 1,
					yieldWeight: item.yield,
				};
			}
			//calculate yield weight
			const yieldWeight = product.isLiquid ? item.yield * product.density : item.yield;
			//Add relevant data to item and return
			return {
				...item,
				unit: product.isLiquid ? 'L' : 'kg',
				product: product.name,
				isLiquid: product.isLiquid,
				density: product.density,
				yieldWeight,
			};
		});

		return result;
	};

	/**
	 * Get all recipes sorted by given options
	 * @param {*} param0
	 * @returns
	 */
	const getAllSorted = ({ field = null, asc = null } = {}) => {
		if (typeof asc !== 'boolean') asc = true;
		if (['name', 'notes', 'product', 'recipeId'].includes(field)) {
			//String fields
			return sortArrayAlphabetic(getAll(), field, asc);
		} else if (['yield'].includes(field)) {
			//Numeric sorted fields
			if (field === 'yield') field = 'yieldWeight';
			return sortArrayNumeric(getAll(), field, asc);
		} else {
			//Not sorted
			return getAll();
		}
	};

	/**
	 * Get recipes that consumes the specified product
	 * @param {string} productId product uuid
	 * @returns {Array} recipes array
	 */
	const getByProduct = (productId = null) => {
		if (!isUuid(productId)) return [];
		if (!recipesState || recipesState.length === 0) return [];
		return recipesState.filter((item) => item.productId === productId);
	};

	/**
	 * Get recipes that consumes the specified material
	 * @param {string} materialId material uuid
	 * @returns {Array} recipes array
	 */
	const getByMaterial = (materialId = null) => {
		if (!isUuid(materialId)) return [];
		if (!recipesState || recipesState.length === 0) return [];

		const result = recipesState.filter((item) => {
			return item.materials.find((mat) => mat.materialId === materialId);
		});

		return result ? result : [];
	};

	const recipes = {
		recipesState,
		findById,
		count: () => recipesState.length,
		getByProduct,
		getByMaterial,
		getAllSorted,
	};

	return { recipes };
}
