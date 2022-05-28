import { v4 as uuidv4, validate as isUuid } from 'uuid';

/**
 * Available Dispatches:
 *
 * @param {*} state current state
 * @param {*} action dispatch request params
 */
export default function endproductsReducer(state, action) {
	const { type, payload = {}, error, success, dependencies = {} } = action;
	const { defaultFields } = dependencies;

	const defaults = {
		//Form fields
		...defaultFields,
		//Auto Generated & Constant fields
		endId: null,
		//Calculated Fields
		updatedAt: Date.now(),
		cost: { recipeCost: 0, recipeTax: 0, packageCost: 0, packageTax: 0, total: 0, totalWithTax: 0 },
		costHistory: [],
	};

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
		/**
		 * Create a new endproduct
		 * Called through endproduct form
		 */
		case 'add': {
			//Validate payload
			const { recipeId, packageId } = payload || {};
			if (!isUuid(recipeId) || !isUuid(packageId)) return onError('InvalidData');

			// Create new endproduct obj with unique id
			const newItem = { ...defaults, ...payload, createdAt: Date.now(), endId: uuidv4() };

			//Check recipeId & packageId combination
			const duplicates = state.filter((item) => item.packageId === packageId && item.recipeId === recipeId);
			if (duplicates.length > 0) {
				return onError('duplicate');
			}
			//Return new state
			return onSuccess([...state, newItem]);
		}

		/**
		 * Update an endproduct
		 * Requires a valid endId
		 */
		case 'update': {
			// HANDLE UPDATE END PRODUCT REQUEST
			//Get new item data
			if (!payload || !isUuid(payload?.endId)) return onError('invalidId');
			const { endId, ...newData } = payload;

			//Find current item from state
			const currentItem = state.find((item) => item.endId === endId);

			//Item doesn't exist
			if (!currentItem) return onError('notFound');

			//merge old data with new
			const newItem = { ...currentItem, ...newData };

			//Check if recipeId or packageId changed
			const { recipeId, packageId } = newItem;

			if (recipeId !== currentItem.recipeId || packageId !== currentItem.packageId) {
				//Go through each product to see if there is a duplicate (same recipe & package combo)
				const duplicates = state.filter((item) => {
					if (item.endId === endId) return false; //Skip self
					if (item.recipeId === recipeId && item.packageId === packageId) return true;
					return false;
				});
				if (duplicates.length > 0) {
					//There are other items with the same recipe & package ID. dont save
					return onError('duplicate');
				}
			}

			//Compare old and new data
			if (JSON.stringify(newItem) === JSON.stringify(currentItem)) {
				//Nothing to update
				return onError('noChange');
			}

			//Update update time
			newItem.updatedAt = Date.now();

			//Update state using map to keep order intact
			const newState = state.map((item) => (item.endId === endId ? newItem : item));

			return onSuccess(newState);
		}

		/**
		 * Remove an endproduct
		 * Requires a valid endId
		 */
		case 'delete': {
			const endId = payload;
			if (!isUuid(endId)) return onError('invalidId');

			//Find current item from state
			const currentItem = state.find((item) => item.endId === endId);

			//Item doesn't exist
			if (!currentItem) return onError('notFound');

			//filter state to remove the item to be deleted
			const newState = state.filter((item) => item.endId !== endId);

			return onSuccess(newState);
		}

		/**
		 * Receives an array with {endId: x, ...costData}
		 * Maps the state and adds the received cost data if necessary
		 * If no cost was changed, wont update state
		 */
		case 'productCosts': {
			if (!Array.isArray(payload)) return error();
			//Received new costs,
			//Map current state and update if any item received new cost
			const newState = state.map((item) => {
				//get new cost data for this item
				const newCost = { ...payload.find((costItem) => costItem.endId === item.endId) };
				//Failed to find new cost for this item
				if (!newCost) return item;
				//Remove id
				delete newCost.endId;
				//Compare new cost to items last cost
				if (item.cost && 'total' in item.cost) {
					if (JSON.stringify(newCost) === JSON.stringify(item.cost)) {
						//Old and new data are identical. return original item no need to update
						return item;
					}
				}

				//Create new cost history item
				const newHistoryItem = { date: Date.now(), amount: newCost.totalWithTax || 0 };
				let newCostHistory = [];
				//If there already is a cost history, spread it
				if (item.costHistory && Array.isArray(item.costHistory)) {
					newCostHistory = [...item.costHistory];
				}
				//Add new history item
				newCostHistory.unshift(newHistoryItem);
				//Remove excess
				if (newCostHistory.length > 10) {
					newCostHistory.splice(9);
				}
				//Create new item
				return { ...item, cost: newCost, costHistory: newCostHistory };
			});

			//A new state array is ready. Must compare
			if (JSON.stringify(state) === JSON.stringify(newState)) {
				//No need for update
				return state;
			}
			return newState;
		}

		/**
		 * Removes all endproducts
		 */
		case 'reset': {
			return onSuccess([]);
		}
		
		/**
		 * Invalid Dispatch
		 */
		default: {
			throw new Error('Invalid Dispatch Type @ Endproducts');
		}
	}
} //EOF
