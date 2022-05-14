import React from 'react';
import { AppContextProvider } from './app';
import SettingsProvider from './settings';

export default function ContextWrapper({ children }) {
	return (
		<AppContextProvider>
			<SettingsProvider>
				{/* Wrap */}
				{children}
			</SettingsProvider>
		</AppContextProvider>
	);
}
