import React, { createContext, useEffect, useReducer } from 'react';
import useStorageRepo from '../hooks/common/useStorageRepo';
import useWidgetsDefaults from './widgets/useWidgetsDefaults';
import useWidgetsReducer from './widgets/useWidgetsReducer';

export const WidgetsContext = createContext();

export default function WidgetsContextProvider({ children }) {
	const { defaultWidgetsData } = useWidgetsDefaults();
	const widgetsReducer = useWidgetsReducer({ version: 'v1' });
	const [widgetsRepo, setWidgetsRepo] = useStorageRepo('application', 'widgets', defaultWidgetsData);
	const [widgets, dispatch] = useReducer(widgetsReducer, widgetsRepo);

	useEffect(() => {
		setWidgetsRepo(widgets);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [widgets]);

	return <WidgetsContext.Provider value={{ widgets, dispatch }}>{children}</WidgetsContext.Provider>;
}
