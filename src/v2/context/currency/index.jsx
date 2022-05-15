import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useCurrencyDefaults from './useCurrencyDefaults';
import useCurrencyReducer from './useCurrencyReducer';

export const CurrencyContext = createContext();
export const CurrencyDispatchContext = createContext();

export default function CurrencyProvider({ children }) {
	//Load initial data & Reducer
	const { initialData } = useCurrencyDefaults();
	const currencyReducer = useCurrencyReducer();
	//Set up repo & State
	const [currencyRepo, setCurrencyRepo] = useStorageRepo('application', 'currencies', initialData);
	const [currencies, dispatch] = useReducer(currencyReducer, currencyRepo);
	//Update repo if state changes
	useEffect(() => {
		setCurrencyRepo(currencies);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currencies]);

	return (
		<CurrencyContext.Provider value={currencies}>
			<CurrencyDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</CurrencyDispatchContext.Provider>
		</CurrencyContext.Provider>
	);
}
