import { getMaxInArray } from '../../lib/common';
import { defaultPackage } from './usePackages';

export default function packagesReducer(state, action) {
	const { type, payload, onError = null, onSuccess = null } = action;
	const emptyPackage = {
		//Form fields
		...defaultPackage,
		//Auto Generated & Constant fields
		packageId: null,
		//Calculated Fields
		createdAt: Date.now(),
		updatedAt: Date.now(),
		cost: 0,
		currency: 0,
		tax: 0,
		costWithTax: 0,
		costHistory: [],
	};

	//Callbacks
	const success = (newState) => {
		onSuccess?.();
		return newState;
	};
	const error = () => {
		onError?.();
		return state;
	};
	//Reducers

	switch (type) {
		case 'add': {
			if (!payload || typeof payload !== 'object' || Object.keys(payload).length < Object.keys(defaultPackage).length) {
				//Erroneous
				return error();
			}
			//Calculate next id
			emptyPackage.packageId = getNextId(state);

			//create new item by merging empty object and payload
			const newItem = { ...emptyPackage, ...payload };
			//Add to state
			return success([...state, newItem]);
		}
		case 'updateAll': {
			//Replace state with given array
			if (!payload || Array.isArray(payload) === false) {
				return error();
			}
			return success(payload);
		}
		case 'reset': {
			return success([]);
		}
		default: {
			throw new Error(`Unknown reducer action received: ${type}`);
		}
	}

	return state;
}

const getNextId = (state = null) => {
	if (!state || Array.isArray(state) === false || state.length === 0) return 0;
	const currentMaxId = parseInt(getMaxInArray(state, 'packageId', false));
	if (isNaN(currentMaxId)) return 0;
	return currentMaxId + 1;
};
