import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useRecipesReducer from './useRecipesReducer';

//Create Required Contexts
export const RecipesContext = createContext();
export const RecipesDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Recipes *
 */
export default function RecipesProvider({ children }) {
	//Load Reducer
	const reducer = useRecipesReducer();
	//Set up repo & State
	const [recipesRepo, setRecipesRepo] = useStorageRepo('application', 'recipes', []);
	const [recipes, dispatch] = useReducer(reducer, recipesRepo);

	//Update repo if state changes
	useEffect(() => {
		setRecipesRepo(recipes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipes]);

	return (
		<RecipesContext.Provider value={recipes}>
			<RecipesDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</RecipesDispatchContext.Provider>
		</RecipesContext.Provider>
	);
}
