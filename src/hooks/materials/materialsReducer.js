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

			//Update updateAt
			mergedPayload.updatedAt = Date.now();

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

		case 'addPriceHistory': {
			//Check payload
			const { materialId, priceItem } = payload;
			if (!priceItem || isNaN(materialId) || 'date' in priceItem === false) return state;
			priceItem.amount = parseFloat(priceItem.amount);
			if (isNaN(priceItem.amount)) priceItem.amount = 0;

			//Load requested material
			const material = state.find((item) => item.materialId === materialId);
			if (!material) return state;

			//Load price histories
			let priceHistory = material.priceHistory ? [...material.priceHistory] : [];

			//Get latest prices
			const { price } = getLatestPrice(material);

			//Check if price has changed enough to warrant an update
			if (!hasPriceChanged(price, priceItem.amount)) return state;

			//Add new price to array
			console.log(`Adding new price to ${material.name}. New: ${priceItem.amount} Old: ${price}`);
			priceHistory.unshift(priceItem);

			//Remove excess items
			if (priceHistory.length > 10) priceHistory.splice(10);

			//Replace this material in state
			return state.map((item) => {
				//Other materials
				if (item.materialId !== materialId) return item;
				//This material that needs updating
				return { ...material, priceHistory: [...priceHistory] };
			});
		}

		case 'addLocalPriceHistory': {
			//Check payload
			const { materialId, priceItem } = payload;
			if (!priceItem || isNaN(materialId) || 'date' in priceItem === false) return state;
			priceItem.amount = parseFloat(priceItem.amount);
			if (isNaN(priceItem.amount)) priceItem.amount = 0;

			//Load requested material
			const material = state.find((item) => item.materialId === materialId);
			if (!material) return state;

			//Load price histories
			let localPriceHistory = material.localPriceHistory ? [...material.localPriceHistory] : [];

			//Get latest local prices
			const { localPrice } = getLatestPrice(material);

			//Check if price has changed enough to warrant an update
			if (!hasPriceChanged(localPrice, priceItem.amount)) return state;

			//Add new price to array
			console.log(`Adding new local price to ${material.name}. New: ${priceItem.amount} Old: ${localPrice}`);
			localPriceHistory.unshift(priceItem);

			//Remove excess items
			if (localPriceHistory.length > 10) localPriceHistory.splice(10);

			//Replace this material in state
			return state.map((item) => {
				//Other materials
				if (item.materialId !== materialId) return item;
				//This material that needs updating
				return { ...material, localPriceHistory: [...localPriceHistory] };
			});
		}

		/* Invalid Action Type */
		default: {
			throw new Error(`Invalid dispatch type: ${type}`);
		}
	}
}

function getLatestPrice(material) {
	const result = { localPrice: 0, price: 0 };
	if (!material) return result;
	if (Array.isArray(material.priceHistory) && material.priceHistory.length > 0) {
		const lastPriceItem = material.priceHistory[0];
		if (lastPriceItem && lastPriceItem.amount && isNaN(parseFloat(lastPriceItem.amount)) === false) {
			//Found latest price
			result.price = parseFloat(lastPriceItem.amount);
		}
	}
	if (Array.isArray(material.localPriceHistory) && material.localPriceHistory.length > 0) {
		const lastPriceItem = material.localPriceHistory[0];
		if (lastPriceItem && lastPriceItem.amount && isNaN(parseFloat(lastPriceItem.amount)) === false) {
			//Found latest price
			result.localPrice = parseFloat(lastPriceItem.amount);
		}
	}
	return result;
}

function hasPriceChanged(previous, current) {
	previous = parseFloat(previous);
	current = parseFloat(current);
	if (isNaN(previous)) previous = 0;
	if (isNaN(current)) current = 0;
	const diff = Math.abs(Math.round((current - previous) * 100) / 100);

	return diff <= 0 ? false : true;
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
