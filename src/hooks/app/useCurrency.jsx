import { useReducer, useEffect } from 'react';
import useStorageRepo from '../common/useStorageRepo';
import currenciesReducer from './currenciesReducer';
import useConfig from './useConfig';

export default function useCurrency() {
	//Get enabled currencies
	const config = useConfig();
	const defaultCurrency = config.getDefaultCurrency(true);
	const enabledCurrencies = config.getCurrenciesArray({ exclude: defaultCurrency });
	//Initial Data
	const initialData = generateInitialData(defaultCurrency, enabledCurrencies);
	//Set up repo for rates
	const [ratesRepo, setRatesRepo] = useStorageRepo('application', 'currencies', initialData);
	const [rates, dispatch] = useReducer(currenciesReducer, ratesRepo);


	useEffect(() => {
		setRatesRepo(rates);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rates]);

	/**
	 * Get current rate object for currency
	 * Including history of the currency if available and requested
	 * @param {object} param0 from: currency code, history: number of historical data to be included
	 * @returns object
	 */
	const getRateFor = ({ from = null, history = 0 }) => {
		const defaultData = { rate: 1, date: Date.now(), history: [] };
		if (!from || from === defaultCurrency) return defaultData;
		if (enabledCurrencies.includes(from) === false || from in rates === false) return defaultData;

		//Find requested data
		const currencyData = rates[from];
		if (!currencyData || Array.isArray(currencyData) === false || currencyData.length === 0) return defaultData;

		const result = { rate: 1, date: Date.now(), history: [] };
		currencyData.forEach((item, index) => {
			//Check requested history depth. If exceeds, dont process the rest of the array
			if (index > history) return;
			//Index 0 is the newest item in the array. Use it as current rate
			if (index === 0) {
				result.rate = item.rate;
				result.date = item.date;
			} else {
				//Add the current item to result history
				result.history.unshift({ rate: item.rate, date: item.date });
			}
		});
		//Sort history by date
		result.history = result.history.sort((a, b) => a.date < b.date);

		return result;
	};

	/**
	 * Return the latest exchange rate for currency if available or return 1 if not
	 * @param {string} currency currency code
	 * @returns float
	 */
	const getCurrentRate = (currency = null) => {
		if (!currencies || enabledCurrencies.includes(currency) === false || currency in rates === false) return 1;
		if (Array.isArray(rates[currency]) && rates[currency].length > 0) {
			const result = rates[currency][0];
			return isNaN(parseFloat(result.rate)) ? 1 : Math.round(parseFloat(result.rate) * 100) / 100;
		}
		return 1;
	};

	/**
	 * Find the newest exchange rate data and extract its date
	 * @returns date in epoch timestamp
	 */
	const getLatestDate = () => {
		const keys = Object.keys(rates);
		let result = 0;
		keys.forEach((key) => {
			if (rates[key] && Array.isArray(rates[key]) && rates[key].length > 0) {
				const item = rates[key][0]; //get the first item
				if (item && 'date' in item) {
					const latestDateForCurrency = item.date;
					if (latestDateForCurrency > result) result = latestDateForCurrency;
				}
			}
		});
		return result > 0 ? result : null;
	};

	//Context Payload
	const currencies = {
		rates,
		defaultCurrency,
		enabledCurrencies,

		getRateFor,
		getLatestDate,
		getCurrentRate,
		symbol: (code) => config.getCurrencySymbol(code),
	};
	return { currencies, dispatchCurrencies: dispatch };
} //End of hook

//==================// Helpers //==================//

/**
 * Generate exchange rates for a number of currencies with todays date and conversion rate of 1
 * @param {string} defaultCurrency currency code
 * @param {[string]} availableCurrencies array of currency codes
 * @returns object with currency codes as keys
 */
const generateInitialData = (defaultCurrency = 'TRY', availableCurrencies = []) => {
	if (!defaultCurrency || !availableCurrencies || availableCurrencies.length === 0) return {};

	//Iterate all available currencies and create initial data for each. Store it in result
	let result = {};
	availableCurrencies.forEach((item) => {
		result[item] = [{ date: Date.now(), from: item, to: defaultCurrency, rate: 1 }];
	});
	return result;
};
