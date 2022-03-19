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
			//Validate payload
			payload = validateMaterialData(payload);
			if (!payload) {
				//Invalid data
				error?.();
				return state;
			}
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
			//Validate payload
			payload = validateMaterialData(payload);
			if (!payload) {
				//Invalid data
				error?.();
				return state;
			}

			//Create new state with updated item
			const result = state.map((item) => {
				if (item.materialId !== payload.materialId) {
					return item;
				} else {
					//The one to be updated
					return payload;
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
			let priceHistory = [...material.priceHistory];
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
	if (materialId && typeof materialId === 'number') {
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
