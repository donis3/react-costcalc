import { useTranslation } from 'react-i18next';
import useCompanyCosts from '../company/useCompanyCosts';
import useRecipe from '../recipes/useRecipe';
import useEndproducts from './useEndproducts';

export default function useEndProduct(endId = null) {
	const { labourCost, overheadCost } = useCompanyCosts();

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
	if (labourCost && endProduct && endProduct.cost && labourCost?.net) {
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

	let overheadItems = [];
	if (overheadCost && endProduct && endProduct.cost && overheadCost?.net) {
		let weight = parseFloat(endProduct?.getWeight());
		if (isNaN(weight)) weight = 0;
		//Add it as a cost item as well
		const costItem = {
			name: t('labels.overheadCost'),
			price: overheadCost.net,
			tax: overheadCost.tax,
			quantity: weight,
			unit: null,
			amount: overheadCost.net * weight, //must be cost without tax
			currency: overheadCost.currency,
		};
		overheadItems.push(costItem);
	}
	return { endProduct, recipeItems, packageItems, labourItems, overheadItems };
}
