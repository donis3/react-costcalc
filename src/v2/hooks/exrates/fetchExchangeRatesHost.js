import axios from "axios";

const axiosOptions = { timeout: 20000 };

/**
 * Fetches using base currency and returns base/quote
 * We want reversed pairs.
 *
 * IMPORTANT: Must add a unique timestamp with each request to avoid browser cache
 * Because the url is the same, we'll get cached response otherwise
 *
 *
 * @param {*} currencies
 * @param {*} baseCurrency
 * @param {*} provider
 * @param {*} apiKey
 * @returns
 */
export default async function fetchExchangeRatesHost(
	currencies = [],
	baseCurrency = null,
	provider,
	apiKey = null,
) {
	const { url, requiresKey } = provider || {};
	if (!url || (requiresKey && !apiKey)) return;
	if (!Array.isArray(currencies) || currencies.length === 0 || !baseCurrency)
		return;

	//https://exchangerate.host/#/#docs options
	axiosOptions.params = {
		source: baseCurrency,
		currencies: currencies.join(","),
		timestamp: Date.now(),
		access_key: requiresKey ? apiKey : undefined,
	};

	//Fetch Data
	try {
		const response = await axios.get(url, axiosOptions);

		const { quotes, success, source } = response?.data || {};
		if (!success || !quotes || !source) throw new Error("notWorking");
		// Returnes quotes with source currency included like TRYUSD.

		//Create currency array
		const result = Object.keys(quotes).reduce((acc, code) => {
			const originalCode = code;
			//Remove the first 3 letters
			code = code.toUpperCase().replace("TRY", "");
			//Check if currency code is in the list
			if (!currencies.includes(code)) return acc;
			//Extract the rate from quotes using the original currency key returned from the api
			const rate = parseFloat(quotes[originalCode]);
			if (isNaN(rate) || rate <= 0) return acc;
			//Reverse the value
			let reversedRate = 1 / rate;

			return [...acc, { code, rate: reversedRate }];
		}, []);

		return result;
	} catch (error) {
		throw new Error(error.message);
	}
}
