import { useState } from 'react';
import { useMaterialContext, useProductsContext, useRecipesContext } from '../../context/MainContext';

export default function useRecipe(recipeId) {
	const { recipes } = useRecipesContext();
	const { products } = useProductsContext();
	const { Materials: materials } = useMaterialContext();

	return { recipe: new Recipe(recipes.findById(recipeId), products, materials) };
} //========================// End of hook

class Recipe {
	products = null;
	materials = null;
	recipe = null;
	product = null;

	constructor(data, products, materials) {
		if (!data || typeof data !== 'object' || 'recipeId' in data === false) return null;
		if (!products || typeof products !== 'object') return null;
		if (!materials || typeof materials !== 'object') return null;
		this.products = products;
		this.recipe = data;
		this.materials = materials;

		//Assign values to obj keys
		Object.keys(data).forEach((key) => {
			this[key] = data[key];
		});
		//Load product
		this.product = products.findById(data.productId);
		if (this.product && this.product.isLiquid === true) {
			this.unit = 'L';
		} else {
			this.unit = 'kg';
		}
		//Load materials
		if (data.materials && Array.isArray(data.materials) && data.materials.length > 0) {
			this.materials = data.materials.map((item) => {
				//Load corresponding material
				const mat = materials.findById(item.materialId);
				const result = {
					...item,
					name: mat.name,
					density: mat.density,
					weight: parseFloat(item.amount) * parseFloat(mat.density),
				};
				return result;
			});
		}
	}

	changeRecipeYield(newYield = 0) {
		newYield = parseFloat(newYield);
		if (isNaN(newYield) || newYield < 0 || newYield === this.yield) return null;
		//Calculate ratio
		const ratio = newYield / this.yield;
		//change yield
		this.yield = ratio * this.yield;
		//change materials
		if (Array.isArray(this.materials)) {
			this.materials = this.materials.map((item) => {
				return {
					...item,
					amount: parseFloat(item.amount) * ratio,
					weight: parseFloat(item.weight) * ratio,
				};
			});
		}
		//Return new obj
		return this;
	}

	resetRecipeYield() {
		return this.changeRecipeYield(this.recipe.yield);
	}
}
