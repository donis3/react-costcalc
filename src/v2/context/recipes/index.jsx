import React, { createContext, useReducer, useEffect } from 'react';
import useConfig from '../../hooks/app/useConfig';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import recipesReducer from './recipesReducer';
import useRecipesDefaults from './useRecipesDefaults';

//Create Required Contexts
export const RecipesContext = createContext();
export const RecipesDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Recipes *
 */
export default function RecipesProvider({ children }) {
	const config = useConfig();
	const historyLimit = config.get('history.recipeCost') || 10;
	//Set up repo & State
	const [recipesRepo, setRecipesRepo] = useStorageRepo('application', 'recipes', []);
	const [recipes, dispatch] = useReducer(recipesReducer, recipesRepo);

	//Update repo if state changes
	useEffect(() => {
		setRecipesRepo(recipes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipes]);

	const { defaultRecipe } = useRecipesDefaults();

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ Recipes');
		//Inject
		action.dependencies = { defaultRecipe, historyLimit };
		//Dispatch
		dispatch(action);
	};

	return (
		<RecipesContext.Provider value={recipes}>
			<RecipesDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</RecipesDispatchContext.Provider>
		</RecipesContext.Provider>
	);
}
