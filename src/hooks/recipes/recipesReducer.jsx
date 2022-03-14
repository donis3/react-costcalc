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