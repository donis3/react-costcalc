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
		 * Invalid Dispatch
		 */
		default: {
			throw new Error('Invalid Dispatch Type @ Products');
		}
	}
} //EOF
