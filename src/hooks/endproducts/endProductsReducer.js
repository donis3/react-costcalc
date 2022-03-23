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

			return success([...state, newItem]);
		}
		case 'reset': {
			return success([]);
		}
		default: {
			throw new Error('Invalid endProduct reducer type received');
		}
	}
}
