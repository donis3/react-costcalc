import { useContext } from 'react';
import { validate as isUuid } from 'uuid';
import { RecipesDispatchContext } from '.';
import useMoney from '../../hooks/app/useMoney';
import useMaterials from '../materials/useMaterials';
import useProducts from '../products/useProducts';
import Recipe from './recipe';
import useRecipes from './useRecipes';

export default function useRecipe(recipeId = null) {
	const { recipes } = useRecipes();
	const dispatch = useContext(RecipesDispatchContext);
	const { products } = useProducts();
	const { Materials: materials } = useMaterials();
	const { convert, defaultCurrency } = useMoney();

	if (!isUuid(recipeId)) {
		return { recipe: null };
	}
	//Create a new recipe instance for the given id
	const recipe = new Recipe(recipes.findById(recipeId), products, materials, convert, dispatch, defaultCurrency);

	return { recipe };
}
