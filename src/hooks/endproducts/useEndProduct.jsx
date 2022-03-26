import { useEndProductsContext } from '../../context/MainContext';
import useRecipe from '../recipes/useRecipe';

export default function useEndProduct(endId = null) {
	const {endProducts} = useEndProductsContext();
	
	const endProduct = endProducts ? endProducts.findById(endId, true) : null;
	const { recipe } = useRecipe(endProduct?.recipeId);

	//Load recipe with a yield same as this products volume/weight
	let recipeItems = [];
	if (recipe && endProduct && endProduct.package && endProduct.package.packageCapacity) {
		if (parseFloat(endProduct.package.packageCapacity) > 0) {
			const { materials } = recipe.changeRecipeYield(endProduct.package.packageCapacity);
			//Deep copy materials as recipeItems
			if (Array.isArray(materials)) {
				recipeItems = materials.map((mat) => ({ ...mat }));
			}
		}
	}
	
	let packageItems = [];
	if (endProduct && endProduct.package && endProduct.package.items) {
		if (Array.isArray(endProduct.package.items)) {
			packageItems = endProduct.package.items.map((item) => ({ ...item }));
		}
	}

	return { endProduct, recipeItems, packageItems };
}
