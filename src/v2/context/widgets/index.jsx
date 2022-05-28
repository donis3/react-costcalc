import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useWidgetsDefaults from './useWidgetsDefaults';
import widgetsReducer from './widgetsReducer';

export const WidgetsContext = createContext();
export const WidgetsDispatchContext = createContext();

export default function WidgetsProvider({ children }) {
	//Defaults
	const { defaultWidgetsData, defaultTodo } = useWidgetsDefaults();
	//Set up repo & State
	const [widgetsRepo, setWidgetsRepo] = useStorageRepo('application', 'widgets', defaultWidgetsData);
	const [widgets, dispatch] = useReducer(widgetsReducer, widgetsRepo);

	//Update repo if state changes
	useEffect(() => {
		if (!widgets || (defaultWidgetsData && Object.keys(widgets).length !== Object.keys(defaultWidgetsData).length)) {
			console.warn('Detected data corruption @widgets. Widgets data is reset back to defaults.');
			setWidgetsRepo(defaultWidgetsData);
		} else {
			setWidgetsRepo(widgets);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [widgets]);

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ currency');

		//Inject
		action.dependencies = {
			defaultTodo,
		};
		//Dispatch
		dispatch(action);
	};

	return (
		<WidgetsContext.Provider value={widgets}>
			<WidgetsDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</WidgetsDispatchContext.Provider>
		</WidgetsContext.Provider>
	);
}
