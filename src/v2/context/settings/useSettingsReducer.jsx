import { useTranslation } from 'react-i18next';
import currency from '../../config/currency.json';
import useConfig from '../../hooks/app/useConfig';
import useDefaultSettings from './useDefaultSettings';

export default function useSettingsReducer() {
	const config = useConfig();
	const providers = config.get('apiProviders') || [];
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
			//Get keys from default state and dont allow any outside keys
			const cleanNewState = Object.keys(initialData).reduce((acc, key) => {
				if (key in newState) {
					return { ...acc, [key]: newState[key] };
				} else {
					return { ...acc, [key]: initialData[key] };
				}
			}, {});
			//Add timestamp
			cleanNewState.updatedAt = Date.now();
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
				//Error Checking
				if (!payload || 'currencies' in payload === false || 'apiProvider' in payload === false) {
					return onError('error.InvalidData');
				}
				if (!state.setupComplete && !currencyCodes.includes(payload?.defaultCurrency)) {
					return onError('error.UnsupportedCurrency');
				}

				//Initial Setup
				if (state.setupComplete > 0 && 'defaultCurrency' in payload) {
					if (payload.defaultCurrency !== state.defaultCurrency) {
						return onError('error.DefaultCurrencyChange');
					}
				}

				//Get payload currencies
				const currencies = Array.isArray(payload?.currencies) ? payload.currencies : [];
				const favoriteCurrencies = Array.isArray(payload?.favoriteCurrencies) ? payload.favoriteCurrencies : [];

				//Filter currencies and remove default currency if exists
				const newState = {
					...state,
					...payload,
					currencies: currencies.filter((c) => c !== payload.defaultCurrency),
					favoriteCurrencies: favoriteCurrencies.filter((c) => c !== payload.defaultCurrency),
				};

				//Set setup complete if this is initial setup
				if (!state.setupComplete) newState.setupComplete = Date.now();

				//Sort
				newState.currencies.sort();
				newState.favoriteCurrencies.sort();

				console.log('TODO: If a currency is removed, go through all data and remove items using that');

				return onSuccess(newState);
			}

			/**
			 * Check if currently active api is still available in config.
			 * Dispatch this action from settings page
			 */
			case 'ApiHealthCheck': {
				//Check if currently selected api is still available in config
				const apiId = state.apiProvider;
				if (!apiId) return state;
				const provider = providers.find((item) => item.id === apiId);

				if (!provider) {
					//Selected api provider is no longer available. Remove it
					return onSuccess({ ...state, apiProvider: '', apiKey: '' });
				}
				return state;
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
