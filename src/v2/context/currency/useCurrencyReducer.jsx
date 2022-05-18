import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useSettings from '../settings/useSettings';

export default function useCurrencyReducer() {
	const { t } = useTranslation('pages/currency');
	const { currencies } = useSettings();
	const config = useConfig();
	const historyLimit = config.get('history.exchangeRates') > 0 ? parseInt(config.get('history.exchangeRates')) : 10;

	let enabled = [];
	let defaultCurrency = null;
	if (Array.isArray(currencies?.enabled)) {
		enabled = [...currencies.enabled];
	}
	if (currencies?.default) {
		defaultCurrency = currencies.default;
	}

	/**
	 * Settings Reducer
	 * @param {*} state
	 * @param {*} action
	 * @returns state
	 */
	function currencyReducer(state, action) {
		const { type, payload = {}, error, success } = action;

		const onSuccess = (newState) => {
			success?.();
			return newState;
		};

		const onError = (code) => {
			error?.(code ? t(`error.${code}`) : '');
			return state;
		};

		/**
		 * Add the given rate to the currency array and return new array
		 * @param {*} from
		 * @param {*} to
		 * @param {*} newRateValue
		 * @returns
		 */
		const addRate = (from, to, newRateValue) => {
			//Validate new rate
			newRateValue = parseFloat(newRateValue);
			if (!from || !enabled.includes(from)) throw new Error('InvalidCurrency');
			if (!to || to !== defaultCurrency) throw new Error('InvalidDefaultCurrency');
			if (isNaN(newRateValue) || newRateValue <= 0) throw new Error('InvalidRate');

			//Generate new rate item
			const newRate = { from, to, rate: newRateValue, date: Date.now(), change: 0 };

			//Find the previous rate and compare & calculate percent change
			const currentCurrencyArray = state?.[from] ?? [];

			if (currentCurrencyArray.length > 0) {
				let percentChange = 0;
				let { rate: lastRate, date } = currentCurrencyArray[0];
				//Check last save date
				if (date > 1 && Date.now() - date < 30) {
					//A save ocurred in last 30 milliseconds
					throw new Error('TooSoon');
				}
				lastRate = parseFloat(lastRate);
				if (isNaN(lastRate) === false) {
					const diff = newRate.rate - lastRate;
					percentChange = (diff / lastRate) * 100;
					//Important!
					//
					//Difference is too small to be significant. Do not add this rate
					if (Math.abs(percentChange) < 0.001) throw new Error('NoChange');
					//Save percent change in the new rate
					newRate.change = percentChange;
				}
			}

			//Generate new array
			const newCurrencyArray = [newRate, ...currentCurrencyArray];
			//Return new array with history limit sliced
			return newCurrencyArray.slice(0, historyLimit);
		};

		switch (type) {
			/**
			 * Initialize currency repo
			 */
			case 'initialize': {
				if (!Array.isArray(payload)) return onError('InvalidData');
				const currencyArray = [...payload];

				const newState = currencyArray.reduce((acc, code) => {
					if (code in state) {
						return { ...acc, [code]: state[code] };
					} else {
						return { ...acc, [code]: [] };
					}
				}, {});
				return onSuccess(newState);
			}
			/**
			 * Add a new exchange rate
			 */
			case 'AddRate': {
				const { from, to, rate } = payload || {};
				try {
					const newCurrencyArray = addRate(from, to, rate);
					const newState = { ...state, [from]: newCurrencyArray };
					return onSuccess(newState);
				} catch (error) {
					return onError(error.message);
				}
			}

			/**
			 * Initialize currency repo
			 */
			case 'BatchUpdate': {
				if (!Array.isArray(payload) || payload.length === 0) return onError('InvalidData');

				//Generate an object with { code => currencyArray} structure same as state. They'll be merged
				const fetchedCurrencies = payload.reduce((acc, newRateObj) => {
					const { from, to, rate } = newRateObj || {};
					try {
						const newCurrencyArray = addRate(from, to, rate);
						return { ...acc, [from]: newCurrencyArray };
					} catch (error) {
						//There was an error for this rate but ignore it
						return acc;
					}
				}, {});

				//Return merged state
				return onSuccess({ ...state, ...fetchedCurrencies });
			}

			/**
			 * Invalid Dispatch
			 */
			default: {
				throw new Error('Invalid Dispatch Type @ CurrencyReducer');
			}
		}
	} //EOF

	return currencyReducer;
}
