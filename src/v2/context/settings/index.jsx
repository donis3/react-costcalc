import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useDefaultSettings from './useDefaultSettings';
import settingsReducer from './settingsReducer';
import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';

export const SettingsContext = createContext();
export const SettingsDispatchContext = createContext();

export default function SettingsProvider({ children }) {
	//Load initial data & Reducer
	const { initialData } = useDefaultSettings();

	//Set up repo & State
	const [settingsRepo, setSettingsRepo] = useStorageRepo('application', 'settings', initialData);
	const [settings, dispatch] = useReducer(settingsReducer, settingsRepo);
	//Update repo if state changes
	useEffect(() => {
		setSettingsRepo(settings);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	//Load Dependencies
	const { t } = useTranslation('pages/settings');
	const config = useConfig();
	const providers = config.get('apiProviders') || [];

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ settings');

		//Inject
		action.dependencies = {
			providers,
			t,
			initialData,
		};
		//Dispatch
		dispatch(action);
	};

	return (
		<SettingsContext.Provider value={settings}>
			<SettingsDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</SettingsDispatchContext.Provider>
		</SettingsContext.Provider>
	);
}
