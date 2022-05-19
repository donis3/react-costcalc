import { useContext, useState } from 'react';
import useSettings from '../../context/settings/useSettings';
import useConfig from '../app/useConfig';
import useExchangeCache from './useExchangeCache';
import fetchTcmb from './fetchTcmb';
import fetchExchangeRatesHost from './fetchExchangeRatesHost';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { CurrencyDispatchContext } from '../../context/currency';

/**
 * Each api id from the config must have a fetcher function
 */
const fetchers = {
	exhost: fetchExchangeRatesHost,
	tcmb: fetchTcmb,
};

/**
 * Exchange Rate Remote Service Fetching System
 *
 * @returns
 */
export default function useExchangeRates() {
	const { t, i18n } = useTranslation('pages/currency');
	//Currency repo dispatcher
	const dispatch = useContext(CurrencyDispatchContext);
	//Detect current api provider
	const { settings, currencies } = useSettings();
	const config = useConfig();
	const providers = config.get('apiProviders') || [];
	//Active Provider
	let provider = { id: null, localName: null };
	if (settings?.apiProvider) {
		const activeProvider = providers.find((p) => p.id === settings.apiProvider);
		if (activeProvider) provider = { ...provider, ...activeProvider };
	}
	const isDisabled = provider.id === 'none' || provider.id === null;

	//Get localized provider names
	if (provider.id && i18n.exists(`${provider.id}.name`, { ns: 'pages/currency' })) {
		provider.localName = t(`${provider.id}.name`);
	}
	
	if (!isDisabled && provider.id in fetchers === false) {
		//Check if fetcher exists
		throw new Error('Fetch method must be defined in useExchangeRates for api id: ' + provider.id);
	}
	const fetcher = isDisabled ? null : fetchers[provider.id];

	//Create states
	const [loading, setLoading] = useState(false);
	const { cache, isExpired, setCache } = useExchangeCache(provider);

	//Toast Helpers
	const onSuccess = (msg) => toast.success(msg, { toastId: 'exchangeRateSuccess' });
	const onError = (code) => {
		let errKey = `${provider.id}.${code}`;
		let msg = t('error.fail');
		if (i18n.exists(errKey, { ns: 'pages/currency' })) {
			msg = t(errKey, { ns: 'pages/currency' });
		}
		toast.error(msg, { toastId: 'exchangeRateErr' });
	};

	/**
	 * Fetch remote api data if cache is expired and return data
	 * return cache if not expired
	 * @returns
	 */
	async function fetchRemoteData() {
		if (!provider || !provider?.id || provider.id === 'none') return;
		if (!fetcher) return;
		if (isExpired === false) {
			//Cache is not yet expired
			console.log(`${provider.name}: Using cached data`);
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve(cache.data);
				}, 1000);
			});
		} else {
			//Get remote data
			const data = await fetcher?.(currencies.enabled, currencies.default, provider, settings?.apiKey);
			if (data) setCache(data);
			return data;
		}
	}

	async function fetchExchangeRates() {
		setLoading(true);
		try {
			//Fetch remote data using the chosen adapter. If fails, throws error
			const data = await fetchRemoteData();
			saveExchangeRates(data);
		} catch (error) {
			onError(error.message);
		}
		setLoading(false);
	}

	/**
	 * Takes an array of rate objects and prepares them for dispatch BatchUpdate
	 * @param {*} reversedRates Array of rate objects with {code, rate}
	 */
	function saveExchangeRates(reversedRates) {
		if (!currencies || !currencies?.default) {
			return onError('InvalidData');
		}
		if (!reversedRates || !Array.isArray(reversedRates) || reversedRates.length === 0) {
			return onError('InvalidData');
		}
		const success = () => onSuccess(t('success.refresh', { provider: provider.name }));
		const error = onError;
		const payload = reversedRates.reduce((acc, item) => {
			const { code, rate } = item;
			if (!code || isNaN(parseFloat(rate)) || !currencies.enabled.includes(code) || rate <= 0) return acc;
			const rateItem = { from: code, to: currencies.default, rate: parseFloat(rate) };
			return [...acc, rateItem];
		}, []);
		dispatch({ type: 'BatchUpdate', payload, success, error });
	}

	return { fetchExchangeRates, loading, isDisabled, provider };
}
