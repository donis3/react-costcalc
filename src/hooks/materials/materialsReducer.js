import { fields } from './useMaterials';
import { getMaxInArray } from '../../lib/common';

export default function materialsReducer(state, { type = null, payload = null, success = null, error = null }) {
	const onError = (errorCode = null) => {
		error?.(errorCode);
		return state;
	};

	const onSuccess = (newState = null) => {
		success?.();
		return newState ? newState : state;
	};
	//Data corruption handling
	if (Array.isArray(state) === false) {
		state = [];
	}

	switch (type) {
		/* Add new material */
		case 'add': {
			//Find next id
			const nextMaterialId = state.length > 0 ? getMaxInArray(state, 'materialId', false) + 1 : 0;

			//Add to payload
			payload.materialId = nextMaterialId;

			//merge payload with default fields
			let mergedPayload = getMergedPayload(payload, fields);

			//Validate payload
			mergedPayload = validateMaterialData(mergedPayload);

			//Invalid Payload
			if (!mergedPayload) return onError('invalidItem');

			//Check uniqueness
			const duplicates = state.filter((item) => {
				if (item.name === mergedPayload.name && item.provider === mergedPayload.provider) {
					return true;
				}
				return false;
			});
			if (duplicates.length > 0) return onError('duplicate');

			//Return success
			return onSuccess([...state, mergedPayload]);
		}

		/* Update existing material */
		case 'update': {
			//Confirm material exists
			if (!state.find((item) => item.materialId === payload.materialId)) {
				//Couldnt find requested item
				error?.();
				return state;
			}
			//merge payload with default fields
			let mergedPayload = getMergedPayload(payload, fields);

			//Validate payload
			mergedPayload = validateMaterialData(mergedPayload);
			if (!mergedPayload) {
				//Invalid data
				error?.();
				return state;
			}

			//Create new state with updated item
			const result = state.map((item) => {
				if (item.materialId !== mergedPayload.materialId) {
					return item;
				} else {
					//The one to be updated
					return mergedPayload;
				}
			});

			//callback
			if (typeof success === 'function') success();
			//
			return result;
		}

		/* Delete existing material */
		case 'delete': {
			//Confirm material exists
			if (!state.find((item) => item.materialId === payload.materialId)) {
				//Couldnt find requested item
				error?.();
				return state;
			}
			//Create new state without the item
			const result = state.filter((item) => item.materialId !== payload.materialId);

			//callback
			if (typeof success === 'function') success();
			//return new state
			return result;
		}

		//Add the given local price to price history of this material if necessary
		case 'addToPriceHistory': {
			//Check payload
			const { materialId, priceItem } = payload;
			if (!priceItem || isNaN(materialId) || 'date' in priceItem === false) return state;
			priceItem.amount = parseFloat(priceItem.amount);
			if (isNaN(priceItem.amount)) return state;

			//Load requested material
			const material = state.find((item) => item.materialId === materialId);
			if (!material) return state;
			let latestPrice = 0;
			//Extract latest price from material if exists
			if (material.priceHistory && Array.isArray(material.priceHistory) && material.priceHistory.length > 0) {
				const lastPriceItem = material.priceHistory[0];
				if (lastPriceItem && lastPriceItem.amount && isNaN(parseFloat(lastPriceItem.amount)) === false) {
					//Found latest price
					latestPrice = parseFloat(lastPriceItem.amount);
				}
			}
			//Compare current price to last price and do nothing if they are the same
			const diff = Math.abs(Math.round((priceItem.amount - latestPrice) * 100) / 100);
			if (diff <= 0) return state; //No need to update.
			//Copy price history
			let priceHistory = material.priceHistory ? [...material.priceHistory] : [];
			if (priceHistory.length > 9) {
				priceHistory.splice(9);
			}

			//Replace this material in state
			return state.map((item) => {
				//Other materials
				if (item.materialId !== materialId) return item;
				//This material that needs updating
				return { ...material, priceHistory: [priceItem, ...priceHistory] };
			});
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
	if (isNaN(parseInt(materialId)) === false) {
		data.materialId = parseInt(materialId);
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

function getMergedPayload(payload, fields) {
	if (!fields) return payload;

	return Object.keys(fields).reduce((acc, key) => {
		if (typeof payload === 'object' && key in payload) {
			return { ...acc, [key]: payload[key] };
		} else {
			return { ...acc, [key]: fields[key].default };
		}
	}, {});
}
