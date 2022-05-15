import React from 'react';
import { AppContextProvider } from './app';
import CurrencyProvider from './currency';
import SettingsProvider from './settings';

export default function ContextWrapper({ children }) {
	return (
		<AppContextProvider>
			<SettingsProvider>
				<CurrencyProvider>
					{/* Wrap */}
					{children}
				</CurrencyProvider>
			</SettingsProvider>
		</AppContextProvider>
	);
}
