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
		currencies: { default: defaultCurrency, enabled: enabledCurrencies, allowed: allowedCurrencies },
		defaultCurrency,
		setupComplete: setupComplete(),
	};
}
