import { getMaxInArray } from '../../lib/common';
import { defaultRecipeSchema } from './useRecipeFormSchema';

export default function recipesReducer(state, action) {
	const { type, payload, success, error } = action;
	switch (type) {
		/* Add new recipe */
		case 'add': {
			//Find next id
			const nextRecipeId = getMaxInArray(state, 'recipeId', false) + 1;

			//add id to payload
			payload.recipeId = nextRecipeId;

			//Get default payload
			const defaultObj = defaultRecipeSchema;

			//Merge default and new obj
			const result = { ...defaultObj, ...payload };

			//Add creation time
			result.createdAt = Date.now();

			//callback
			if (typeof success === 'function') success(nextRecipeId);

			//Set new state
			return [...state, result];
		}
		/* Update recipe */
		case 'update': {
			//get the id
			const { recipeId } = payload;

			//Validate id
			if (!state.find((item) => item.recipeId === recipeId)) {
				//Update cant be done. Item not found
				if (typeof error === 'function') error();
				return state;
			}
			//update item update time
			payload.updatedAt = Date.now();

			//Update state array
			return state.map((item) => {
				if (item.recipeId === recipeId) {
					//Found requested item. Call success callback
					if (typeof success === 'function') success(recipeId);

					//this one needs updating. Merge old and new data
					return { ...item, ...payload };
				} else {
					return item;
				}
			});
		}
		case 'addUnitCost': {
			const { recipeId } = payload;
			//Find this recipe
			const recipe = state.find((item) => item.recipeId === recipeId);
			if (!recipe) return state; //No such recipe
			//Make sure unitCosts array exists
			if ('unitCosts' in recipe === false || !Array.isArray(recipe.unitCosts) || recipe.unitCosts.length === 0) {
				recipe.unitCosts = [];
			}
			//compare old and new dates
			if (recipe.unitCosts.find((oldCostObject) => oldCostObject.date === payload.date)) {
				//Same exact date already exists. Dont add this
				console.warn('Add Unit Cost action was called twice.');
				return state;
			}
			//Insert new cost at the start of the array
			recipe.unitCosts.unshift(payload);

			//Remove last element if more than max
			if (recipe.unitCosts.length > 10) {
				recipe.unitCosts.splice(10);
			}

			//Update state array
			return state.map((item) => {
				if (item.recipeId === recipeId) {
					//this one needs updating. Merge old and new data
					return { ...item, ...payload };
				} else {
					return item;
				}
			});
		}
		/* Delete recipe */
		case 'delete': {
			//get the id
			const recipeId = payload;

			//Validate item exists
			if (!state.find((item) => item.recipeId === recipeId)) {
				//Update cant be done. Item not found
				if (typeof error === 'function') error();
				return state;
			}

			//Remove item from state
			if (typeof success === 'function') success();
			return state.filter((item) => item.recipeId !== recipeId);
		}
		default: {
			throw new Error(`Invalid dispatch type: ${type}`);
		}
	}
}
