import axios from "axios";

const axiosOptions = { timeout: 20000 };

/*
https://apilayer.com/marketplace/fixer-api?utm_source=apilayermarketplace&utm_medium=featured#endpoints

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

fetch("https://api.apilayer.com/fixer/latest?symbols={symbols}&base={base}", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

{
  "base": "USD",
  "date": "2022-04-14",
  "rates": {
    "EUR": 0.813399,
    "GBP": 0.72007,
    "JPY": 107.346001
  },
  "success": true,
  "timestamp": 1519296206
*/

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
export default async function fetchFixerApiLayer(
	currencies = [],
	baseCurrency = null,
	provider,
	apiKey = null,
) {
	const { url, requiresKey } = provider || {};
	if (!url || (requiresKey && !apiKey)) return;
	if (!Array.isArray(currencies) || currencies.length === 0 || !baseCurrency)
		return;

	//https://apilayer.com/marketplace/fixer-api?utm_source=apilayermarketplace&utm_medium=featured#endpoints
	axiosOptions.params = {
		base: baseCurrency,
		symbols: currencies.join(","),
	};

	//Authentication
	axiosOptions.headers = { apikey: apiKey };

	//Fetch Data
	try {
		const response = await axios.get(url, axiosOptions);

		const { success, base, rates } = response?.data || {};
		if (!success || !base || !rates) throw new Error("notWorking");
		//Rates keys are 3 letter currency codes

		//Create currency array
		const result = Object.keys(rates).reduce((acc, code) => {
			const currencyKey = code;
			code = code.toUpperCase();
			//Check if currency code is in the list
			if (!currencies.includes(code)) return acc;
			//Extract the rate from quotes using the original currency key returned from the api
			const rate = parseFloat(rates[currencyKey]);
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
