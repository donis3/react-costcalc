import axios from 'axios';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
const axiosOptions = { timeout: 20000, timestamp: Date.now() };

// Expected Result = [ {code: 'USD', rate: 15},...]

export default async function fetchTcmb(currencies = [], baseCurrency = null, provider, apiKey = null) {
	const { url, requiresKey } = provider || {};
	if (!url || (requiresKey && !apiKey)) return;
	if (!Array.isArray(currencies) || currencies.length === 0 || !baseCurrency) return;

	//Only works for TRY bases
	if (baseCurrency !== 'TRY') {
		throw new Error('invalidBase');
	}

	//Fetch Data
	try {
		const response = await axios.get(url, axiosOptions);
		if (response.data) {
			//Convert xml to object
			const data = parseXml(response.data);
			//Convert tcmb data structure to currency array
			const currencyArray = tcmbToCurrencyArray(data);
			if (!currencyArray) throw new Error('parseFail');

			//Extract enabled currency data
			const result = currencyArray.reduce((acc, item) => {
				//Extract
				const code = item?.['__CurrencyCode'];
				let rate = parseFloat(item?.['ForexSelling']);
				//Validate
				if (!currencies.includes(code)) return acc;
				if (!code || isNaN(rate) || rate <= 0) return acc;

				//Add to accumulator
				return [...acc, { code, rate }];
			}, []);
			return result;
		}
	} catch (error) {
		throw new Error(error.message);
	}
}

//Helpers

const parseXml = (xmlData = null) => {
	if (!xmlData) return null;

	if (xmlData && XMLValidator.validate(xmlData)) {
		//Configure parser
		const parser = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: '__',
			ignoreDeclaration: true,
			ignorePiTags: true,
		});
		//Parse xml and get obj
		let jsonObj = parser.parse(xmlData);
		return jsonObj;
	}
	//Failed parse
	return null;
};

const tcmbToCurrencyArray = (parsedXmlData) => {
	if (!parsedXmlData || Object.keys(parsedXmlData).length === 0) return;

	//Tcmb data schema: {'Tarih_Date': { 'Currency': [data, data, ...]}}
	const level0 = Object.values(parsedXmlData)[0];
	if (!level0 || Object.keys(level0).length === 0) return;
	//Find the array in values which will have currency data
	const currencyData = Object.values(level0)
		.filter((item) => Array.isArray(item))
		.pop();
	return currencyData;
};
