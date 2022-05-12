export default function productsReducer(state, action) {
	let { type = null, payload = null, success = () => {}, error = () => {} } = action;
	if (typeof success !== 'function') success = () => {};
	if (typeof error !== 'function') error = () => {};

	//console.log('Got new dispatch request:', action);
	switch (type) {
		case 'delete': {
			if (isNaN(parseInt(payload))) {
				//Invalid payload
				error();
				return state;
			}
			//Find by id
			const result = state.find((item) => item.productId === payload);
			if (!result) {
				//Invalid request. couldnt find item
				error();
				return state;
			}
			//Delete requested item
			success();
			return state.filter((item) => item.productId !== payload);
		}
		case 'add': {
			if (payload && typeof payload === 'object' && 'productId' in payload) {
				//Valid payload
				success();
				return [...state, payload];
			} else {
				//Invalid request
				error();
				return state;
			}
		}
		case 'update': {
			if (!payload || typeof payload !== 'object' || 'productId' in payload === false) {
				//Invalid payload
				error();
				return state;
			}

			//Find by id
			const result = state.find((item) => item.productId === payload.productId);
			if (!result) {
				//Invalid update request
				error();
				return state;
			}
			//create new payload but save current items data that aren't sent through form (example: cost history)
			const newItem = { ...result, ...payload }; //Overwrite new data to existing

			//Call success
			success();

			//Create new state but filter conflicts
			let updateCount = 0;
			let newState = [];

			state.forEach((item) => {
				if (item.productId === payload.productId) {
					//Found a match
					if (updateCount === 0) {
						newState.push(newItem);
						//Avoid conflicting id
						updateCount++;
					}
				} else {
					newState.push(item);
				}
			});

			//replace state
			return newState;
		}
		default: {
			throw new Error('Invalid dispatch request @ productReducer');
			//return state;
		}
	}
}
