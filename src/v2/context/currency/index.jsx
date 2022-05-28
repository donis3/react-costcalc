import React, { createContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useSettings from '../settings/useSettings';

import currencyReducer from './currencyReducer';

export const CurrencyContext = createContext();
export const CurrencyDispatchContext = createContext();

export default function CurrencyProvider({ children }) {
	const config = useConfig();
	const { currencies: currencySettings, setupComplete = false } = useSettings();

	const { enabled: enabledCurrencies, default: defaultCurrency } = currencySettings;

	const historyLimit = config.get('history.exchangeRates') ?? 10;
	const { t } = useTranslation('pages/currency');

	//Set up repo & State
	const [currencyRepo, setCurrencyRepo] = useStorageRepo('application', 'currencies', {});
	const [currencies, dispatch] = useReducer(currencyReducer, currencyRepo);

	//Update repo if state changes
	useEffect(() => {
		setCurrencyRepo(currencies);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currencies]);

	/**
	 * Sync currencies repo with enabled currencies in the settings repo
	 */
	if (setupComplete && Array.isArray(enabledCurrencies)) {
		//Compare enabled currencies to current currencies
		const currentCurrencies = Object.keys(currencies).sort().join('-');
		const referenceCurrencies = [...enabledCurrencies].sort().join('-');
		if (currentCurrencies === referenceCurrencies) {
			// console.log('Currency repo is in sync');
		} else {
			// console.log('Currency repo is out of sync');
			dispatch({ type: 'initialize', payload: [...enabledCurrencies] });
		}
	}

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ currency');

		//Inject
		action.dependencies = {
			t,
			defaultCurrency,
			enabledCurrencies,
			historyLimit,
		};
		//Dispatch
		dispatch(action);
	};

	return (
		<CurrencyContext.Provider value={currencies}>
			<CurrencyDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</CurrencyDispatchContext.Provider>
		</CurrencyContext.Provider>
	);
}
