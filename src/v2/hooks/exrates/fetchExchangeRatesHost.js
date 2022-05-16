import axios from 'axios';
const axiosOptions = { timeout: 20000 };

// Expected Result = [ {code: 'USD', rate: 15},...]

export default async function fetchExchangeRatesHost(currencies = [], baseCurrency = null, provider, apiKey = null) {
	const { url, requiresKey } = provider || {};
	if (!url || (requiresKey && !apiKey)) return;
	if (!Array.isArray(currencies) || currencies.length === 0 || !baseCurrency) return;

	//https://exchangerate.host/#/#docs options
	axiosOptions.params = { base: baseCurrency, symbols: currencies.join(',') };

	//Fetch Data
	try {
		const response = await axios.get(url, axiosOptions);
		const { rates, success, base } = response?.data || {};
		if (!success || !rates || !base) throw new Error('notWorking');

		//Create currency array
		const result = Object.keys(rates).reduce((acc, code) => {
			code = code.toUpperCase();
			if (!currencies.includes(code)) return acc;
			let rate = parseFloat(rates[code]);
			if (isNaN(rate) || rate <= 0) return acc;

			return [...acc, { code, rate }];
		}, []);

		return result;
	} catch (error) {
		throw new Error(error.message);
	}
}
