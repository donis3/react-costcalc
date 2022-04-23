import React, { createContext, useEffect, useReducer } from 'react';
import useStorageRepo from '../hooks/common/useStorageRepo';
import useMordersReducer from './morders/useMordersReducer';
export const MordersContext = createContext();

export default function MordersContextProvider({ children }) {
	const mordersReducer = useMordersReducer();
	const [mordersRepo, setMordersRepo] = useStorageRepo('application', 'morders', []);
	const [morders, dispatch] = useReducer(mordersReducer, mordersRepo);

	useEffect(() => {
		setMordersRepo(morders);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [morders]);

	return <MordersContext.Provider value={{ morders, dispatch }}>{children}</MordersContext.Provider>;
}
