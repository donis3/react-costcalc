import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useEndproductsReducer from './useEndproductsReducer';

//Create Required Contexts
export const EndproductsContext = createContext();
export const EndproductsDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * EndProducts *
 */
export default function EndproductsProvider({ children }) {
	//Load Reducer
	const reducer = useEndproductsReducer();
	//Set up repo & State
	const [endproductsRepo, setEndproductsRepo] = useStorageRepo('application', 'endproducts', []);
	const [endproducts, dispatch] = useReducer(reducer, endproductsRepo);

	//Update repo if state changes
	useEffect(() => {
		setEndproductsRepo(endproducts);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endproducts]);

	return (
		<EndproductsContext.Provider value={endproducts}>
			<EndproductsDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</EndproductsDispatchContext.Provider>
		</EndproductsContext.Provider>
	);
}
