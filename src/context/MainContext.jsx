import React, { createContext, useContext } from 'react';
import useMaterials from '../hooks/materials/useMaterials';

/* Create Contexts Here Separately */
const MaterialContext = createContext();
const MaterialDispatch = createContext();

/* Providers */
export default function MainContext({ children }) {
	const { Materials, dispatch } = useMaterials();

	//All Context Providers wrapped
	return (
		<MaterialContext.Provider value={{ Materials }}>
			<MaterialDispatch.Provider value={{ dispatch }}>
				{/* Wrap the whole app with the context */}
				{children}
			</MaterialDispatch.Provider>
		</MaterialContext.Provider>
	);
}

/* Easy Access Hooks */
export function useMaterialContext() {
	return useContext(MaterialContext);
}
export function useMaterialDispatchContext() {
	return useContext(MaterialDispatch);
}
