import { v4 as uuidv4 } from 'uuid';

/**
 * Dependencies:
 * defaultRecipe
 */

/**
 * Available Dispatches:
 *
 * @param {*} state current state
 * @param {*} action dispatch request params
 */
export default function recipesReducer(state, action) {
	const { type, payload = {}, error, success, dependencies = {} } = action;
	const { defaultRecipe = {}, historyLimit = 10 } = dependencies || {};

	const onSuccess = (newState) => {
		success?.();
		return newState;
	};

	const onError = (code) => {
		error?.(code);
		return state;
	};

	/**
	 *  ======================================================================
	 *                                  Actions
	 *  ======================================================================
	 */
	switch (type) {
		/* Add new recipe */
		case 'add': {
			if (!payload || 'name' in payload === false) return onError('InvalidData');

			//Create recipe merged with default values, and generate guid
			const newRecipe = {
				...defaultRecipe,
				...payload,
				recipeId: uuidv4(),
				//timestamps
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			//Return state with new recipe
			return onSuccess([...state, newRecipe]);
		}
		/* Update recipe */
		case 'update': {
			//get the id
			const { recipeId } = payload;

			//Find subject
			const recipe = state.find((item) => item.recipeId === recipeId);
			if (!recipe) return onError('NotFound');

			//Merge old and new data
			const newRecipe = { ...recipe, ...payload };

			try {
				//Compare new and old values and dont update if both are the same
				if (JSON.stringify(newRecipe) === JSON.stringify(recipe)) return onError('NoChange');
			} catch (error) {
				//Json err
				return onError('InvalidData');
			}

			//update timestamp
			newRecipe.updatedAt = Date.now();

			//Update state
			const newState = state.map((item) => {
				if (item.recipeId !== recipeId) return item;
				return { ...item, ...newRecipe };
			});

			return onSuccess(newState);
		}
		case 'addUnitCost': {
			const { recipeId } = payload;
			//Find this recipe
			const recipe = state.find((item) => item.recipeId === recipeId);
			if (!recipe) return onError('NotFound'); //No such recipe

			//Get current unit costs or create new
			let unitCostsArray = Array.isArray(recipe?.unitCosts) ? [...recipe.unitCosts] : [];

			//compare old and new dates
			if (unitCostsArray.find((oldCostObject) => oldCostObject.date === payload.date)) {
				//Same exact date already exists. Dont add this
				console.warn('Add Unit Cost action was called twice.');
				return onError('TooManyRequests');
			}
			//Insert new cost at the start of the array
			unitCostsArray.unshift(payload);

			//Remove history if over limit
			if (unitCostsArray.length > historyLimit) {
				unitCostsArray = unitCostsArray.slice(0, historyLimit);
			}

			//Update state
			const newState = state.map((item) => {
				if (item.recipeId !== recipeId) return item;
				return { ...item, unitCosts: unitCostsArray };
			});
			
			return onSuccess(newState);
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
		/**
		 * Invalid Dispatch
		 */
		default: {
			throw new Error('Invalid Dispatch Type @ Recipes');
		}
	}
} //EOF
