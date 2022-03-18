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
		unit: 'kg',
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
			//Change unit if needed
			payload.unit = payload?.productType === 'liquid' ? 'L' : 'kg';

			//create new item by merging empty object and payload
			const newItem = { ...emptyPackage, ...payload };
			//Add to state
			return success([...state, newItem]);
		}
		case 'update': {
			if (!payload || typeof payload !== 'object' || Object.keys(payload).length < Object.keys(defaultPackage).length) {
				//Erroneous
				return error();
			}
			//get id
			const { packageId } = payload;

			//Find the target package
			const targetPackage = state.find((item) => item.packageId === packageId);
			if (!targetPackage) return error(); //Couldnt find target item
			//merge old data and new data
			const newPackage = { ...targetPackage, ...payload };
			//Compare old data to new data
			if (JSON.stringify(newPackage) === JSON.stringify(targetPackage)) {
				//No changed were made. No need to update
				return error();
			}
			//Proceed to update. Add update time
			newPackage.updatedAt = Date.now();
			//Map state and update this item
			const newState = state.map((item) => (item.packageId !== packageId ? item : newPackage));

			return success(newState);
		}
		case 'delete': {
			const packageId = parseInt(payload);
			if (isNaN(packageId)) return error();
			const targetPackage = state.find((item) => item.packageId === packageId);
			if (!targetPackage) return error();
			//Target to delete is found, remove it from state
			return success(state.filter((item) => item.packageId !== packageId));
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
}

const getNextId = (state = null) => {
	if (!state || Array.isArray(state) === false || state.length === 0) return 0;
	const currentMaxId = parseInt(getMaxInArray(state, 'packageId', false));
	if (isNaN(currentMaxId)) return 0;
	return currentMaxId + 1;
};
