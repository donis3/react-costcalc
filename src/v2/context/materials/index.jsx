import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useMaterialsReducer from './useMaterialsReducer';

//Create Required Contexts
export const MaterialsContext = createContext();
export const MaterialsDispatchContext = createContext();

/**
 * Context provider & storage repo handler for * Materials *
 */
export default function MaterialsProvider({ children }) {
	//Load Reducer
	const reducer = useMaterialsReducer();
	//Set up repo & State
	const [materialsRepo, setMaterialsRepo] = useStorageRepo('application', 'materials', []);
	const [materials, dispatch] = useReducer(reducer, materialsRepo);

	//Update repo if state changes
	useEffect(() => {
		setMaterialsRepo(materials);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [materials]);

	return (
		<MaterialsContext.Provider value={materials}>
			<MaterialsDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</MaterialsDispatchContext.Provider>
		</MaterialsContext.Provider>
	);
}
