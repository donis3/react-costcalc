import { useState } from 'react';
import useStorageState from '../common/useStorageState';
import useConfig from './useConfig';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCurrencyDispatch } from '../../context/MainContext';
const axiosOptions = { timeout: 20000 };

/**
 * This hook will connect to TCMB today xml and parse it, 
 * extract required exchange rates from the xml and 
 * will dispatch them to currency storage repo
 * @returns 
 */
export default function useTcmbToday() {
	//Config vars
	const config = useConfig();
	const xmlCacheDuration = config.get('exchangeRates.xmlCacheDurationMinutes');
	const xmlKey = config.get('exchangeRates.xmlKey');
	const defaultCurrency = config.getDefaultCurrency(true);
	const enabledCurrencies = config.getCurrenciesArray({ exclude: defaultCurrency });

	//Dependencies
	const { t } = useTranslation();
	const { dispatch } = useCurrencyDispatch();

	//Public states
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	//Store latest xml data in storage cache
	const [xmlCache, setXmlCache] = useStorageState('tcmbCache', { updatedAt: null, xml: null });

	//Helper Functions

	/**
	 * send an exchange rate to currency repo. provide dispatch for currency reducer
	 * @param {string} from currency code
	 * @param {string} to currency code
	 * @param {float} rate exchange rate
	 * @param {function} dispatch dispatch function
	 */
	const dispatchRate = (currency = null, rate = 1) => {
		//Validation
		if (enabledCurrencies.includes(currency) === false) return;
		if (isNaN(parseFloat(rate))) return;
		//Round to 2 decimal places
		rate = Math.round(parseFloat(rate) * 100) / 100;
		//Prepare dispatch actions
		const payload = { from: currency, to: defaultCurrency, rate: rate };
		//dispatch
		dispatch({ type: 'add', payload });
	};

	/**
	 * Parse xml data as object, then go through the object and extract exchange rates
	 * send them to currency repo
	 * @param {*} xmlData
	 * @returns
	 */
	const dispatchXmlRates = (xmlData = null) => {
		//Error display function
		const onXmlError = () => toast.error(t('currency.tcmbParseError'), { id: 'tcmbErr' });
		//Validate xml data
		if (!xmlData) return onXmlError();
		const data = parseTcmbXml(xmlData);
		if (!data || Object.keys(data).length === 0) return onXmlError();

		//Tcmb data schema: {'Tarih_Date': { 'Currency': [data, data, ...]}}
		const level0 = Object.values(data)[0];
		if (!level0 || Object.keys(level0).length === 0) return onXmlError();
		//Find the array in values which will have currency data
		const currencyData = Object.values(level0)
			.filter((item) => Array.isArray(item))
			.pop();
		if (Array.isArray(currencyData) === false || currencyData.length === 0) return onXmlError();

		let dispatchCount = 0;
		//We now have currency data array. We should go through it and dispatch if required
		currencyData.forEach((item) => {
			//Validate Item
			if (xmlKey in item === false) return;
			if ('__CurrencyCode' in item === false) return;
			if (enabledCurrencies.includes(item['__CurrencyCode']) === false) return;
			//Dispatch item
			dispatchRate(item['__CurrencyCode'], item[xmlKey]);
			//Count
			dispatchCount++;
		});
		//display success
		if (dispatchCount > 0) {
			toast.success(t('currency.tcmbSuccess'));
		}
	};

	/**
	 * Fetch tcmb xml data and store it in storage as cache.
	 * If there already is a cache and is not expired, dont fetch new data and use old data
	 * @param {*} ratesDispatch
	 */
	const fetchTcmbRates = () => {
		//Analyze Cache
		const isExpired = isCacheExpired(xmlCache.updatedAt, xmlCacheDuration);

		//Cache not expired yet. Dont fetch new data
		if (isExpired !== true) {
			//Cache is not yet expired
			toast.info(
				t('currency.fetchNotExpired', { timeSince: isExpired.minutesPassed, timeLeft: isExpired.minutesLeft })
			);
			//Dispatch using cache
			dispatchXmlRates(xmlCache.xml);
			return;
		}

		//Set States
		setLoading(true);
		setError(null);

		//Prepare vars
		const target = config.get('exchangeRates.url');
		const proxyTarget = config.get('exchangeRates.proxy') + target;

		//Fetch Data
		axios
			.get(proxyTarget, axiosOptions)
			.then((response) => {
				//Fetch success. Got raw data. Save it in cache
				if (response.data) {
					setXmlCache({ updatedAt: Date.now(), xml: response.data });
					dispatchXmlRates(response.data);
					toast.success(t('currency.fetchSuccess'));
				} else {
					throw new Error("Couldn't fetch TCMB data");
				}
			})
			.catch((error) => {
				toast.error(t('currency.fetchError'));
				setError(error);
			})
			.finally(() => {
				//Set States
				setLoading(false);
			});

		//Parse data
	};

	//Return public states and api
	return { loading, error, fetchTcmbRates };
}

//======================================================================//
//                              HELPERS                                 //
//======================================================================//

/**
 * Return an object with time passed and time left to cache expiry
 * @param {*} updatedAt last cache time
 * @param {*} xmlCacheDurationMinutes max cache time
 * @returns object with {updatedAt, minutesPassed, minutesLeft}
 */
const isCacheExpired = (updatedAt = 0, xmlCacheDurationMinutes = 0) => {
	if (!updatedAt || isNaN(parseInt(updatedAt))) return true;
	if (!xmlCacheDurationMinutes || isNaN(parseInt(updatedAt))) return true;

	//Calculate minutes since update milliseconds/60.000
	const minutesPassed = Math.round((Date.now() - parseInt(updatedAt)) / (1000 * 60)); //minutes since
	//Time left to expire cache
	const minutesLeft = Math.round(xmlCacheDurationMinutes - minutesPassed);

	//Cache is expired, return true
	if (minutesLeft <= 0) return true;
	//Cache not expired, return details
	return { updatedAt, minutesPassed, minutesLeft };
};

/**
 * Parse XML data and get an object with currency code -> rate
 * @param {*} xmlData
 */
const parseTcmbXml = (xmlData = null) => {
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
