import { useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';

import useStorageRepo from '../common/useStorageRepo';
import useProducts from '../products/useProducts';
import recipesReducer from './recipesReducer';

export default function useRecipes() {
	//Repo for local storage
	const [recipesRepo, setRecipesRepo] = useStorageRepo('application', 'recipes', []);
	//Reducer for react state
	const [recipesState, dispatch] = useReducer(recipesReducer, recipesRepo);
	const { t } = useTranslation();
	//Save to local
	useEffect(() => {
		setRecipesRepo(recipesState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipesState]);

	//Products repo
	const { products } = useProducts();

	//Recipes API
	const findById = (recipeId = null) => {
		if (isNaN(parseInt(recipeId))) return;
		recipeId = parseInt(recipeId);
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

	const getAllSorted = ({ field = null, asc = null } = {}) => {
		if (typeof asc !== 'boolean') asc = true;
		if (['name', 'notes', 'product'].includes(field)) {
			return sortArrayAlphabetic(getAll(), field, asc);
		} else if (['recipeId', 'yield'].includes(field)) {
			if (field === 'yield') field = 'yieldWeight';
			return sortArrayNumeric(getAll(), field, asc);
		} else {
			return getAll();
		}
	};

	//Get all recipes that are bound to this product
	const getByProduct = (productId = null) => {
		if (productId === null || isNaN(productId)) return [];
		if (!recipesState || recipesState.length === 0) return [];
		return recipesState.filter((item) => item.productId === productId);
	};

	//Get all recipes that have this material
	const getByMaterial = (materialId = null) => {
		if (materialId === null || isNaN(materialId)) return [];
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

	return { recipes, dispatchRecipes: dispatch };
}
