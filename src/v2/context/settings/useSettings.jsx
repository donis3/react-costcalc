import { useContext } from 'react';
import { SettingsContext } from './index';

export default function useSettings() {
	const settings = useContext(SettingsContext);

	/**
	 * Current Currency Settings
	 */
	const defaultCurrency = settings.defaultCurrency ?? 'USD';
	const enabledCurrencies = [...settings?.currencies?.filter((c) => c !== defaultCurrency)];
	const allowedCurrencies = [defaultCurrency, ...enabledCurrencies];

	return {
		settings,
		currencies: { default: defaultCurrency, enabled: enabledCurrencies, allowed: allowedCurrencies },
		defaultCurrency,
		setupComplete: settings?.setupComplete ?? false,
	};
}
