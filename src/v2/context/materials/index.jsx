import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useSettings from '../settings/useSettings';
import materialsReducer from './materialsReducer';

//Create Required Contexts
export const MaterialsContext = createContext();
export const MaterialsDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Materials *
 */
export default function MaterialsProvider({ children }) {
	//Set up repo & State
	const [materialsRepo, setMaterialsRepo] = useStorageRepo('application', 'materials', []);
	const [materials, dispatch] = useReducer(materialsReducer, materialsRepo);

	//Update repo if state changes
	useEffect(() => {
		setMaterialsRepo(materials);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [materials]);

	//Dependencies
	const { currencies } = useSettings();

	/**
	 * Add dependencies to this modules reducer dispatcher
	 */
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid Dispatch Received');
		//Add all dependencies
		action.dependencies = { defaultCurrency: currencies.default, allowedCurrencies: currencies.allowed };
		//Dispatch
		dispatch(action);
	};

	return (
		<MaterialsContext.Provider value={materials}>
			<MaterialsDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</MaterialsDispatchContext.Provider>
		</MaterialsContext.Provider>
	);
}
