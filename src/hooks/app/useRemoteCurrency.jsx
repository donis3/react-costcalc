import { useState, useMemo } from 'react';
import useAxios from '../common/useAxios';
import useStorageState from '../common/useStorageState';
import useConfig from './useConfig';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';


const remoteConfig = {
	cacheExpiresInMinutes: 30, //only allow new xml request every x minutes
};

export default function useRemoteCurrency() {
	//States
	const [xmlState, setXmlState] = useStorageState('tcmbXml', { date: null, data: null, rawData: null });
	const [isLoading, setIsLoading] = useState(false);
	

	//Dependencies
	const { t } = useTranslation();
	const axios = useAxios();
	const config = useConfig();
	
	//Easy Access  config vars
	const defaultCurrency = config.getDefaultCurrency(true);
	const enabledCurrencies = config.getCurrenciesArray({ exclude: defaultCurrency });
	const xmlKey = config.get('exchangeRates.xmlKey');

	//State Api
	const setStateData = ({ rawData = null, data = null }) => {
		if (!rawData && !data) return;
		const newState = { ...xmlState, date: Date.now() };
		if (rawData) newState.rawData = rawData;
		if (data) newState.data = data;
		setXmlState(newState);
	};

	//Get minutes passed since cached response
	const getTimeSince = () => {
		//No data available, return null
		if (!xmlState || typeof xmlState !== 'object' || 'date' in xmlState === false || !xmlState.date) {
			return null;
		}
		//Find time difference
		const minutesSince = Math.round((Date.now() - xmlState.date) / (1000 * 60));
		return minutesSince;
	};

	//Pass raw xml and get json
	const parseRawData = (rawData = null) => {
		if (rawData && XMLValidator.validate(rawData)) {
			const parser = new XMLParser({
				ignoreAttributes: false,
				attributeNamePrefix: '__',
				ignoreDeclaration: true,
				ignorePiTags: true,
			});
			let jsonObj = parser.parse(rawData);
			return jsonObj;
		}
		//Failed parse
		return null;
	};

	//Fetch rates xml and store it in storage.
	const fetchRates = () => {
		setIsLoading(true);
		const timeSinceLastRequest = getTimeSince();

		//Check if we can refresh yet
		if (timeSinceLastRequest !== null && timeSinceLastRequest < remoteConfig.cacheExpiresInMinutes) {
			config.get('debug.exchangeRates') && console.log(`Last request: ${timeSinceLastRequest} minutes`);
			const timeLeft = remoteConfig.cacheExpiresInMinutes - timeSinceLastRequest;
			//Cant refresh yet
			toast.info(t('currency.fetchNotExpired', { timeSince: timeSinceLastRequest, timeLeft: timeLeft }));
			setIsLoading(false);
			return;
		}

		config.get('debug.exchangeRates') && console.log(`Fetching fresh xml data.`);
		const target = config.get('exchangeRates.url');
		if (!target) return;
		const proxyTarget = config.get('exchangeRates.proxy') + target;
		if (!proxyTarget) return;
		axios
			.get(proxyTarget)
			.then(({ data: rawData }) => {
				//data is raw data
				if (rawData) {
					const data = parseRawData(rawData);
					setStateData({ rawData: rawData, data: data });
					toast.success(t('currency.fetchSuccess'));
				}

				setIsLoading(false);
			})
			.catch((error) => {
				console.log(error);
				toast.error(t('currency.fetchError'));
				setIsLoading(false);
			});
	};

	//Parse TCMB TOday XML object
	const extractTcmbData = (parsedXmlData = {}) => {
		config.get('debug.exchangeRates') && console.log(`Parsing TCMB data`);
		//Default object with currency codes as keys. { USD: 1, EUR: 1, DKK: 1}
		const result = defaultData();
		if (!parsedXmlData || typeof parsedXmlData !== 'object' || Object.keys(parsedXmlData).length === 0) {
			return result; //Default data
		}
		//Get the first property which includes all data of the xml
		const data = parsedXmlData[Object.keys(parsedXmlData)[0]];

		//iterate the array to go through each currency
		Object.keys(data).forEach((item) => {
			if (Array.isArray(data[item]) && data[item].length > 0) {
				//Found the currency array, iterate
				data[item].forEach((cur) => {
					//Check if this currency is enabled in config
					if (cur?.['__CurrencyCode'] in result === false || xmlKey in cur === false) {
						return;
					}
					//get the currency.forexBuying or whatever xmlKey was set in config.
					const rate = Math.round( parseFloat(cur[xmlKey])*100 )/100; //Round to 2 decimal
					result[cur['__CurrencyCode']] =  rate;
				});
			}
		});

		return result;
	};

	//Default each exchange rate is 1
	const defaultData = () => {
		const result = {};
		enabledCurrencies.forEach((item) => {
			result[item] = 1;
		});
		return result;
	};

	//Parse the xml data and return exchange rates

	const payload = {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		exchangeRates: useMemo(() => extractTcmbData(xmlState.data), [xmlState.data]), 
		updatedAt: xmlState.date,
		isLoading,
		fetchRates,
	};
	

	return payload;
}
