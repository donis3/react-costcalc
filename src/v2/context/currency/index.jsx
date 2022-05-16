import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useSettings from '../settings/useSettings';

import useCurrencyReducer from './useCurrencyReducer';

export const CurrencyContext = createContext();
export const CurrencyDispatchContext = createContext();

export default function CurrencyProvider({ children }) {
	const {
		currencies: { enabled = [] },
		setupComplete = false,
	} = useSettings();

	//Load Reducer
	const currencyReducer = useCurrencyReducer();
	//Set up repo & State
	const [currencyRepo, setCurrencyRepo] = useStorageRepo('application', 'currencies', {});
	const [currencies, dispatch] = useReducer(currencyReducer, currencyRepo);

	//Update repo if state changes
	useEffect(() => {
		setCurrencyRepo(currencies);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currencies]);

	//Sync settings currencies
	if (setupComplete && Array.isArray(enabled)) {
		//Compare enabled currencies to current currencies
		const currentCurrencies = Object.keys(currencies).sort().join('-');
		const referenceCurrencies = [...enabled].sort().join('-');
		if (currentCurrencies === referenceCurrencies) {
			// console.log('Currency repo is in sync');
		} else {
			// console.log('Currency repo is out of sync');
			dispatch({ type: 'initialize', payload: [...enabled] });
		}
	}

	return (
		<CurrencyContext.Provider value={currencies}>
			<CurrencyDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</CurrencyDispatchContext.Provider>
		</CurrencyContext.Provider>
	);
}
