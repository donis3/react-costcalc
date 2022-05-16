import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useSettings from '../settings/useSettings';

export default function useCurrencyReducer() {
	const { t } = useTranslation('pages/currency');
	const { currencies } = useSettings();
	const config = useConfig();
	const historyLimit = config.get('history.exchangeRates') > 0 ? parseInt(config.get('history.exchangeRates')) : 10;

	let allowed = [];
	let defaultCurrency = null;
	if (Array.isArray(currencies?.allowed)) {
		allowed = [...currencies.allowed];
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

		const onError = (code, ...args) => {
			error?.(code ? t(`error.${code}`) : '');
			console.log(args);
			return state;
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
				//Validation
				if (!from || !allowed.includes(from)) return onError('InvalidCurrency');
				if (to !== defaultCurrency || !allowed.includes(to)) return onError('InvalidDefaultCurrency');
				if (isNaN(parseFloat(rate)) || rate <= 0) return onError('InvalidRate');
				const newRate = { from, to, rate: parseFloat(rate), date: Date.now(), change: 0 };

				//Find the previous rate and compare
				let percentChange = 0;
				let { rate: lastRate, date } = state?.[from]?.[0] || {};
				//Check last save date
				if (date > 1 && Date.now() - date < 30) {
					//A save ocurred in last 30 milliseconds
					return state;
				}

				lastRate = parseFloat(lastRate);
				if (isNaN(lastRate) === false) {
					const diff = newRate.rate - lastRate;
					percentChange = (diff / lastRate) * 100;
					if (Math.abs(percentChange) < 0.001) return onError();
					//Save percent change in the new rate
					newRate.change = percentChange;
				}

				//Create new state
				const newState = { ...state, [from]: [newRate, ...state?.[from]] };
				//Remove elements if limit is exceeded
				if (newState[from].length > historyLimit) {
					newState[from] = newState[from].slice(0, historyLimit);
				}
				return onSuccess(newState);
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
