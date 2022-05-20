import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import recipesReducer from './recipesReducer';

//Create Required Contexts
export const RecipesContext = createContext();
export const RecipesDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Recipes *
 */
export default function RecipesProvider({ children }) {
	//Set up repo & State
	const [recipesRepo, setRecipesRepo] = useStorageRepo('application', 'recipes', []);
	const [recipes, dispatch] = useReducer(recipesReducer, recipesRepo);

	//Update repo if state changes
	useEffect(() => {
		setRecipesRepo(recipes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipes]);

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ Recipes');
		//Inject
		action.dependencies = {};
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
