import { v4 as uuidv4, validate } from 'uuid';

/**
 * Available Dispatches:
 *
 * @param {*} state current state
 * @param {*} action dispatch request params
 */
export default function productsReducer(state, action) {
	const { type, payload = {}, error, success, dependencies = {} } = action;

	const onSuccess = (newState) => {
		success?.();
		return newState;
	};

	const onError = (code) => {
		error?.(code);
		return state;
	};

	/**
	 *  ======================================================================
	 *                                  Actions
	 *  ======================================================================
	 */
	switch (type) {
		/**
		 * Delete a product
		 * payload: productId
		 */
		case 'delete': {
			const productId = payload;
			if (!validate(productId)) return onError('InvalidId');

			//Find by id
			const result = state.find((item) => item.productId === payload);
			if (!result) {
				return onError('NotFound');
			}

			//Delete requested item
			return onSuccess(state.filter((item) => item.productId !== payload));
		}

		/**
		 * Add a product
		 * payload: product data obj
		 */
		case 'add': {
			if (!payload || Object.keys(payload).length === 0) return onError('InvalidRequest');
			const newProduct = { ...payload, productId: uuidv4() };
			return onSuccess([...state, newProduct]);
		}

		/**
		 * Update a product
		 * payload: product data obj
		 */
		case 'update': {
			if (!payload || !validate(payload?.productId)) return onError('InvalidRequest');

			//Find by id
			const subject = state.find((item) => item.productId === payload.productId);
			if (!subject) return onError('NotFound');

			//Merge with payload and create updated product
			const newItem = { ...subject, ...payload };

			//Update state with new product
			const newState = state.map((item) => {
				if (item.productId !== newItem.productId) return item;
				return newItem;
			});

			return onSuccess(newState);
		}

		/**
		 * Invalid Dispatch
		 */
		default: {
			throw new Error('Invalid Dispatch Type @ Products');
		}
	}
} //EOF
