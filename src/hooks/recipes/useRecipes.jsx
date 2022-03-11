import { useReducer, useEffect } from 'react';
import useStorageRepo from '../common/useStorageRepo';
import recipesReducer from './recipesReducer';

export default function useRecipes() {
	//Repo for local storage
	const [recipesRepo, setRecipesRepo] = useStorageRepo('application', 'recipes', []);
	//Reducer for react state
	const [recipesState, dispatch] = useReducer(recipesReducer, recipesRepo);
	//Save to local
	useEffect(() => {
		setRecipesRepo(recipesState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipesState]);

	//Recipes API
	const findById = (recipeId = null, isForForm = false) => {
		if (isNaN(parseInt(recipeId))) return;
		recipeId = parseInt(recipeId);
		const result = recipesState.find((item) => item.recipeId === recipeId);
		//Remove unnecessary fields if this data will be used for edit recipe form
		if (isForForm && result) {
			delete result.updatedAt;
			delete result.costs;
		}
		return result;
	};

	const recipes = {
		recipesState,
		findById,
	};

	return { recipes, dispatchRecipes: dispatch };
}
