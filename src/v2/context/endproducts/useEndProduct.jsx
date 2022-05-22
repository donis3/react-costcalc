import { useTranslation } from 'react-i18next';
import useRecipe from '../recipes/useRecipe';
import useEndproducts from './useEndproducts';

export default function useEndProduct(endId = null) {
	const labourCost = {};
	console.log('UseEndProduct: requires labor cost from company');
	const { t } = useTranslation('translation');
	const endProducts = useEndproducts();

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
			} catch (e) {
				console.log('Recipe load error: ', e.message);
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

	let labourItems = [];
	if (labourCost && endProduct && endProduct.cost && endProduct.cost.labourCost) {
		let weight = parseFloat(endProduct?.getWeight());
		if (isNaN(weight)) weight = 0;
		//Add it as a cost item as well
		const costItem = {
			name: t('labels.labourCost'),
			price: labourCost.net,
			tax: labourCost.tax,
			quantity: weight,
			unit: null,
			amount: labourCost.net * weight, //must be cost without tax
			currency: labourCost.currency,
		};
		labourItems.push(costItem);
	}
	return { endProduct, recipeItems, packageItems, labourItems };
}
