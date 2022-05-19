import { useContext } from 'react';
import { RecipesContext } from '.';

/**
 * Use only this hook to access products context
 */
export default function useRecipes() {
	const recipes = useContext(RecipesContext);

	return { recipes };
}
