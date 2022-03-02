import { fields } from './useMaterials';
import { getMaxInArray } from '../../lib/common';

export default function materialsReducer(state, { type = null, payload = null, success = null, error = null }) {
	switch (type) {
		/* Add new material */
		case 'add': {
			//Find next id
			const nextMaterialId = getMaxInArray(state, 'materialId', false) + 1;
			//Add to payload
			payload.materialId = nextMaterialId;
			//callback
			if (typeof success === 'function') success();
			//Set new state
			return [...state, payload];
		}

		/* Update existing material */
		case 'update': {
			//Confirm material exists
			if (!state.find((item) => item.materialId === payload.materialId)) {
				//Couldnt find requested item
				error?.();
				return state;
			}
			//Create new state with updated item
			const result = state.map((item) => {
				if( item.materialId !== payload.materialId){
					return item;
				}else {
					//The one to be updated
					return payload;
				}
			});

			//callback
			if (typeof success === 'function') success();
			//
			return result;
		}

		/* Invalid Action Type */
		default: {
			throw new Error(`Invalid dispatch type: ${type}`);
		}
	}
}

//Filter given data get clean object
function validateMaterialData(data = null, materialId = null) {
	if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
		//Validation failed
		return null;
	}
	//If a material id is provided, add it to object
	if (materialId && typeof materialId === 'number' && materialId > 0) {
		data.materialId = materialId;
	}

	//Generate a new object with allowed keys
	const result = Object.keys(data).reduce((accumulator, current) => {
		//If this key exists in fields, allow it
		if (Object.keys(fields).includes(current)) {
			return { ...accumulator, [current]: data[current] };
		}
		return accumulator;
	}, {});

	//If key numbers are the same, allow it to be saved
	if (Object.keys(result).length === Object.keys(fields).length) {
		return result;
	}
	//Validation failed
	return null;
}
