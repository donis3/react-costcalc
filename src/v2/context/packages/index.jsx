import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import usePackagesReducer from './usePackagesReducer';

//Create Required Contexts
export const PackagesContext = createContext();
export const PackagesDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Packages *
 */
export default function PackagesProvider({ children }) {
	//Load Reducer
	const reducer = usePackagesReducer();
	//Set up repo & State
	const [packagesRepo, setPackagesRepo] = useStorageRepo('application', 'packages', []);
	const [packages, dispatch] = useReducer(reducer, packagesRepo);

	//Update repo if state changes
	useEffect(() => {
		setPackagesRepo(packages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packages]);

	return (
		<PackagesContext.Provider value={packages}>
			<PackagesDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</PackagesDispatchContext.Provider>
		</PackagesContext.Provider>
	);
}
