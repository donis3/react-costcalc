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
			let materials = [];
			try {
				const yieldChangedRecipe = recipe.changeRecipeYield(endProduct.package.packageCapacity);
				materials = yieldChangedRecipe.materials;
			} catch(e) {
				console.log('Recipe load error: ', e.message)
			}
			
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
