import { useEffect, useReducer } from 'react';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import useStorageRepo from '../common/useStorageRepo';
import endProductsReducer from './endProductsReducer';

export default function useEndProducts() {
	//Load local storage for this repo
	const [endProductsRepo, setEndProductsRepo] = useStorageRepo('application', 'endproducts', []);
	//Initialize state using local storage data
	const [endProductsState, dispatch] = useReducer(endProductsReducer, endProductsRepo);
	//Whenever state changes, save it to local storage repo
	useEffect(() => {
		setEndProductsRepo(endProductsState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endProductsState]);

	function getAllSorted({ field = 'name', asc = true } = {}) {
		if (typeof asc !== 'boolean') asc = true;
		if (['name', 'notes', 'commercialName'].includes(field)) {
			return sortArrayAlphabetic(this.data, field, asc);
		} else if (['endId', 'recipeId', 'packageId'].includes(field)) {
			return sortArrayNumeric(this.data, field, asc);
		} else {
			return this.data;
		}
	}

	function findById(endId = null) {
		endId = parseInt(endId);
		if (isNaN(endId)) return null;
		const result = this.data.find((item) => item.endId === endId);

		if (!result) return null;
		return result;
	}

	//Exports
	const endProductPayload = {
		data: endProductsState,
		getAllSorted,
		findById,
	};
	return [endProductPayload, dispatch];
}
