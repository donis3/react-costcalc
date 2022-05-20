import { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsContext } from './index';
import currency from '../../config/currency.json';
import useConfig from '../../hooks/app/useConfig';

export default function useSettings() {
	const config = useConfig();
	const settings = useContext(SettingsContext);
	const { t, i18n } = useTranslation('currencies');

	/**
	 * Get active api provider
	 */
	const getCurrentApiProvider = useCallback(() => {
		let currentApiProvider = { id: null, name: 'none', requiresKey: false, url: null };
		if (settings?.apiProvider) {
			const provider = config.all.apiProviders.find((item) => item.id === settings?.apiProvider);
			if (provider) {
				currentApiProvider = { ...currentApiProvider, ...provider };
			}
		}
		return currentApiProvider;
	}, [config.all.apiProviders, settings?.apiProvider]);

	/**
	 * Current Currency Settings
	 */
	const defaultCurrency = settings.defaultCurrency ?? 'USD';
	const enabledCurrencies = useMemo(() => {
		return [...settings?.currencies?.filter((c) => c !== defaultCurrency)];
	}, [settings?.currencies, defaultCurrency]);
	const allowedCurrencies = useMemo(
		() => [defaultCurrency, ...enabledCurrencies],
		[defaultCurrency, enabledCurrencies]
	);

	const favoriteCurrencies = Array.isArray(settings?.favoriteCurrencies) ? [...settings.favoriteCurrencies] : [];

	const getCurrencyNames = useCallback(() => {
		return allowedCurrencies.reduce((acc, code) => {
			let currencyName = code;
			if (i18n.exists(code, { ns: 'currencies' })) {
				currencyName = t(code, { ns: 'currencies' });
			} else if (code in currency) {
				currencyName = currency[code].name;
			}
			return { ...acc, [code]: currencyName };
		}, {});
	}, [allowedCurrencies, i18n, t]);

	const getCurrencySymbols = useCallback(() => {
		return allowedCurrencies.reduce((acc, code) => {
			let symbol = code;
			if (code in currency) {
				symbol = currency[code]?.symbol ?? code;
			}
			return { ...acc, [code]: symbol };
		}, {});
	}, [allowedCurrencies]);

	//Is initial setup compelte?
	const setupComplete = () => {
		if (!settings) return false;
		if ('setupComplete' in settings) {
			if (settings.setupComplete > 0) {
				return true;
			}
		}
		return false;
	};

	return {
		settings,
		currencies: {
			default: defaultCurrency,
			enabled: enabledCurrencies,
			allowed: allowedCurrencies,
			favorites: favoriteCurrencies,
			getNames: getCurrencyNames,
			getSymbols: getCurrencySymbols,
		},
		defaultCurrency,
		getCurrentApiProvider,
		setupComplete: setupComplete(),
	};
}
