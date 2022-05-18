import React, { useState } from 'react';
import useSettings from '../../context/settings/useSettings';
import useConfig from '../app/useConfig';
import useExchangeCache from './useExchangeCache';
import fetchTcmb from './fetchTcmb';
import fetchExchangeRatesHost from './fetchExchangeRatesHost';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

/**
 * Each api id from the config must have a fetcher function
 */
const fetchers = {
	api1: fetchExchangeRatesHost,
	api2: fetchTcmb,
};

export default function useExchangeRates() {
	const { t, i18n } = useTranslation('pages/currency');
	//Detect current api provider
	const { settings, currencies } = useSettings();
	const config = useConfig();
	const providers = config.get('apiProviders') || [];
	let provider = { id: 'none' };
	if (settings?.apiProvider) provider = providers.find((p) => p.id === settings.apiProvider);
	const isDisabled = provider.id === 'none';

	//Check if fetcher exists
	if (!isDisabled && provider.id in fetchers === false) {
		throw new Error('Fetch method must be defined in useExchangeRates for api id: ' + provider.id);
	}
	const fetcher = isDisabled ? null : fetchers[provider.id];

	//Create states
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const { cache, isExpired, setCache } = useExchangeCache(provider);

	/**
	 * Fetch remote api data if cache is expired and return data
	 * return cache if not expired
	 * @returns
	 */
	async function fetchRemoteData() {
		if (provider.id === 'none') return;
		if (!fetcher) return;
		if (isExpired === false) {
			//Cache is not yet expired
			console.log('Using cached data with mock fetch wait time.');
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
			console.log(data);
		} catch (error) {
			//Catch error from the adapter and toast it
			let errKey = `${provider.id}.${error.message}`;
			let msg = t('error.fetchFailed');
			if (i18n.exists(errKey, { ns: 'pages/currency' })) {
				msg = t(errKey, { ns: 'pages/currency' });
			}
			toast.error(msg);
		}
		setLoading(false);

		console.log('TODO: Send rates to dispatch');
	}

	return { fetchExchangeRates, loading, data, error, isDisabled, provider };
}
