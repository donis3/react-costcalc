import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import endproductsReducer from './endproductsReducer';

//Create Required Contexts
export const EndproductsContext = createContext();
export const EndproductsDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * EndProducts *
 */
export default function EndproductsProvider({ children }) {
	//Set up repo & State
	const [endproductsRepo, setEndproductsRepo] = useStorageRepo('application', 'endproducts', []);
	const [endproducts, dispatch] = useReducer(endproductsReducer, endproductsRepo);

	//Update repo if state changes
	useEffect(() => {
		setEndproductsRepo(endproducts);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endproducts]);

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ Endproducts');
		//Inject
		action.dependencies = {};
		//Dispatch
		dispatch(action);
	};

	return (
		<EndproductsContext.Provider value={endproducts}>
			<EndproductsDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</EndproductsDispatchContext.Provider>
		</EndproductsContext.Provider>
	);
}
