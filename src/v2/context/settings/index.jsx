import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useDefaultSettings from './useDefaultSettings';
import useSettingsReducer from './useSettingsReducer';

export const SettingsContext = createContext();
export const SettingsDispatchContext = createContext();

export default function SettingsProvider({ children }) {
	//Load initial data & Reducer
	const { initialData } = useDefaultSettings();
	const settingsReducer = useSettingsReducer();
	//Set up repo & State
	const [settingsRepo, setSettingsRepo] = useStorageRepo('application', 'settings', initialData);
	const [settings, dispatch] = useReducer(settingsReducer, settingsRepo);
	//Update repo if state changes
	useEffect(() => {
		setSettingsRepo(settings);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	return (
		<SettingsContext.Provider value={settings}>
			<SettingsDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</SettingsDispatchContext.Provider>
		</SettingsContext.Provider>
	);
}
