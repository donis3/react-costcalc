import { getMaxInArray } from '../../lib/common';

const defaultFields = {
	recipeId: '',
	packageId: '',
	name: '',
	commercialName: '',
	notes: '',
};

export default function endProductsReducer(state, action) {
	const { type, payload, onError = null, onSuccess = null } = action;

	//Default end product fields
	const defaults = {
		//Form fields
		...defaultFields,
		//Auto Generated & Constant fields
		endId: null,
		//Calculated Fields
		updatedAt: Date.now(),
	};

	//Callbacks
	const success = (newState) => {
		onSuccess?.();
		return newState;
	};
	const error = (errorCode = null) => {
		onError?.(errorCode);
		return state;
	};
	switch (type) {
		case 'add': {
			// HANDLE NEW END PRODUCT REQUEST
			const newItem = { ...defaults, ...payload, createdAt: Date.now() };
			const nextEndId = state.length > 0 ? getMaxInArray(state, 'endId', false) + 1 : 0;
			const recipeId = parseInt(newItem.recipeId);
			const packageId = parseInt(newItem.packageId);
			if (isNaN(recipeId) || isNaN(packageId)) return error();

			newItem.endId = nextEndId;
			//Check recipeId & packageId combination
			const duplicates = state.filter((item) => item.packageId === packageId && item.recipeId === recipeId);
			if (duplicates.length > 0) {
				return error('duplicate');
			}
			//Return new state
			return success([...state, newItem]);
		}
		case 'update': {
			// HANDLE UPDATE END PRODUCT REQUEST
			//Get new item data
			if (!payload || 'endId' in payload === false) return error('invalidId');
			payload.endId = parseInt(payload.endId);
			const { endId, ...newData } = payload;
			if (isNaN(endId) || !newData) return error('invalidId');

			//Find current item from state
			const currentItem = state.find((item) => item.endId === endId);
			//Item doesn't exist
			if (!currentItem) return error('notFound');

			//merge old data with new
			const newItem = { ...currentItem, ...newData };

			//Check if recipeId or packageId changed
			const newRecipeId = parseInt(newItem.recipeId);
			const newPackageId = parseInt(newItem.packageId);
			if (newRecipeId !== currentItem.recipeId || newPackageId !== currentItem.packageId) {
				//There is a change. Run duplicate prevention
				const duplicates = state.filter((item) => {
					if (item.endId === endId) return false; //Skip self
					if (item.recipeId === newRecipeId && item.packageId === newPackageId) return true;
					return false;
				});
				if (duplicates.length > 0) {
					//There are other items with the same recipe & package ID. dont save
					return error('duplicate');
				}
			}

			//Compare old and new data
			if (JSON.stringify(newItem) === JSON.stringify(currentItem)) {
				//Nothing to update
				return error();
			}

			//Update update time
			newItem.updatedAt = Date.now();

			//Update state using map to keep order intact
			const newState = state.map((item) => (item.endId === parseInt(endId) ? newItem : item));

			return success(newState);
		}
		case 'delete': {
			// HANDLE DELETE END PRODUCT REQUEST
			//Get endId
			const endId = parseInt(payload);
			if (isNaN(endId)) return error('invalidId');

			//Find current item from state
			const currentItem = state.find((item) => item.endId === endId);
			//Item doesn't exist
			if (!currentItem) return error('notFound');

			//filter state to remove the item to be deleted
			const newState = state.filter((item) => item.endId !== endId);

			return success(newState);
		}
		case 'reset': {
			return success([]);
		}
		default: {
			throw new Error('Invalid endProduct reducer type received');
		}
	}
}
