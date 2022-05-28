import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import packagesReducer from './packagesReducer';
import usePackagesDefaults from './usePackagesDefaults';

//Create Required Contexts
export const PackagesContext = createContext();
export const PackagesDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Packages *
 */
export default function PackagesProvider({ children }) {
	//Set up repo & State
	const [packagesRepo, setPackagesRepo] = useStorageRepo('application', 'packages', []);
	const [packages, dispatch] = useReducer(packagesReducer, packagesRepo);

	//Update repo if state changes
	useEffect(() => {
		setPackagesRepo(packages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packages]);

	const { defaultPackage } = usePackagesDefaults();

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ Packages');
		//Inject
		action.dependencies = { defaultPackage };
		//Dispatch
		dispatch(action);
	};

	return (
		<PackagesContext.Provider value={packages}>
			<PackagesDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</PackagesDispatchContext.Provider>
		</PackagesContext.Provider>
	);
}
