import { getMaxInArray } from '../../lib/common';

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
			const defaultObj = generateDefaultRecipe();

			//Merge default and new obj
			const result = { ...defaultObj, ...payload };

			//callback
			if (typeof success === 'function') success();
			
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
				return;
			}

			//Update state array
			return state.map((item) => {
				if (item.recipeId === recipeId) {
					//Found requested item. Call success callback
					if (typeof success === 'function') success();

					//this one needs updating. Merge old and new data
					return { ...item, ...payload };
				} else {
					return item;
				}
			});
		}
		default: {
			throw new Error(`Invalid dispatch type: ${type}`);
		}
	}
}

const generateDefaultRecipe = () => {
	let result = {
		recipeId: 0,
		//Which product is this recipe for? Will get density & isLiquid data from this
		productId: 0,
		//Update time for this recipe
		updatedAt: Date.now(),

		//Recipe yield in its own base unit (kg /L )
		yield: 100,

		//List of materials used. Amounts are in materials own unit
		materials: [],

		//Cost per unit in default currency array. Current cost is the the index 0. (newest)
		costs: [
			//each item will have change which is percent change of the new cost against the previous.
			//This is to calculate it only when a new cost is calculated
			{ date: Date.now(), cost: 0, tax: 0, total: 0, change: 0 },
		],
	};
	return result;
};
