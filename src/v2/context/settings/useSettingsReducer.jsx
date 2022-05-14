import { useTranslation } from 'react-i18next';
import currency from '../../config/currency.json';
import useDefaultSettings from './useDefaultSettings';

export default function useSettingsReducer() {
	const { t } = useTranslation('pages/settings');
	const currencyCodes = Object.keys(currency) || [];
	const { initialData } = useDefaultSettings();

	/**
	 * Settings Reducer
	 * @param {*} state
	 * @param {*} action
	 * @returns state
	 */
	function settingsReducer(state, action) {
		const { type, payload, error, success } = action;

		/**
		 * Handle success middleware
		 * Removes keys that weren't in the default state
		 * @param {*} newState
		 * @returns
		 */
		const onSuccess = (newState) => {
			success?.();
			//Remove excess
			const cleanNewState = Object.keys(newState).reduce((acc, key) => {
				if (key in initialData) {
					return { ...acc, [key]: newState[key] };
				} else {
					console.log(`Settings: Detected and removed invalid state key: ${key}`);
					return acc;
				}
			}, {});
			return cleanNewState;
		};

		const onError = (code) => {
			error?.(code ? t(code) : '');
			return state;
		};

		switch (type) {
			/**
			 * Save settings
			 * requires payload with all settings
			 */
			case 'SaveSettings': {
				if (!payload || 'defaultCurrency' in payload === false || 'apiProvider' in payload === false) {
					return onError('error.InvalidData');
				}
				if (!currencyCodes.includes(payload.defaultCurrency)) {
					return onError('error.UnsupportedCurrency');
				}
				//Get payload currencies
				const currencies = Array.isArray(payload?.currencies) ? payload.currencies : [];
				//Filter currencies and remove default currency if exists
				const newState = { ...state, ...payload, currencies: currencies.filter((c) => c !== payload.defaultCurrency) };
				//Set setup complete
				newState.setupComplete = Date.now();
				newState.currencies.sort();

				return onSuccess(newState);
			}

			/**
			 * Invalid Dispatch
			 */
			default: {
				throw new Error('Invalid Dispatch Type @ SettingsReducer');
			}
		}
	} //EOF

	return settingsReducer;
}
