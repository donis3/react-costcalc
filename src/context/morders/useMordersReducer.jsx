import { v4 as uuidv4, validate } from 'uuid';

export default function useMordersReducer() {
	const defaultMorder = {
		id: null,
		date: Date.now(),
		productId: null,
		quantity: 0,
        notes: '',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	function reducer(state, action) {
		//Extract data and define error/success operations
		const { type, payload, success, error } = action || {};
		function onError() {
			error?.();
			return state;
		}
		function onSuccess(newState) {
			success?.();
			return newState;
		}

		//Reducer Cases
		switch (type) {
			case 'add': {
				return onSuccess(state);
			}

			/**
			 * Default Action Type
			 */
			default: {
				throw new Error('Invalid action type provided to manufacturing orders reducer');
			}
		}
	}

	return reducer;
}
