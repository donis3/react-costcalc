const currencySettings = {
	maxHistoricalData: 5, //Per currency
};

export default function currenciesReducer(state, action) {
	const { type = null, payload = null, success = () => {}, error = () => {} } = action;

	//Return passed in state after calling success()
	const onSuccess = (newState) => {
		if (typeof success === 'function') success();
		return newState;
	};

	//Return original state aftercalling error ()
	const onError = () => {
		if (typeof error === 'function') error();
		return state;
	};

	//Add a new conversion rate to the state and return new state
	const getRateObject = ({ from = null, to = null, rate = 1 } = {}) => {
		//Validation
		if (
			!from ||
			!to ||
			isNaN(parseFloat(rate)) ||
			parseFloat(rate) < 0 ||
			typeof from !== 'string' ||
			typeof to !== 'string' ||
			from.length < 2 ||
			to.length < 2
		) {
			return null;
		}
		//Generate new rate
		return {
			date: Date.now(),
			from: from,
			to: to,
			rate: Math.round(parseFloat(rate) * 100) / 100, //2 decimal only
		};
	};

	//REDUCER
	switch (type) {
		case 'add': {
			//Generate a new rate entry
			const newRate = getRateObject(payload);
			//If payload is invalid, do nothing
			if (!newRate) return onError();
			//Get current currency data from state if exists
			let currentCurrencyRates = [];
			if (newRate.from in state === true) {
				currentCurrencyRates = state[newRate.from];
			}
			//Compare previous rate if exists
			if (currentCurrencyRates.length > 0 && 'rate' in currentCurrencyRates[0]) {
				const previousRate = parseFloat(currentCurrencyRates[0]?.rate);
				if (previousRate === newRate.rate) {
					//Same rate. Dont add
					return onError();
				}
			}
			//add new rate as the first element
			currentCurrencyRates = [newRate, ...currentCurrencyRates];
			//Remove last element if max history size is exceeded
			if (currentCurrencyRates.length > currencySettings.maxHistoricalData+1) {
				currentCurrencyRates.pop();
			}
			//console.log(`[Currencies] New ${newRate.from} rate: ${newRate.rate.toFixed(2)}`);
			//create new state including other currencies

			return onSuccess({
				...state,
				[newRate.from]: currentCurrencyRates,
			});
		}
		case 'reset': {
			//Return empty object as state
			return onSuccess({});
		}

		default: {
			throw new Error(`[Currencies] Invalid dispatch request: ${type}`);
		}
	}
}
