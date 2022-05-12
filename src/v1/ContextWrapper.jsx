import React from 'react';
import { AppContextProvider } from './context/AppContext';
import CompanyContextProvider from './context/CompanyContext';
import MainContext from './context/MainContext';
import WidgetsContextProvider from './context/WidgetsContext';

/**
 * Wrapper for every global state context of the application
 * 
 */
export default function ContextWrapper({ children }) {
	return (
		<AppContextProvider>
			<CompanyContextProvider>
				<WidgetsContextProvider>
					<MainContext>
						{/* Main Context has all application contexts in it */}
						{children}
					</MainContext>
				</WidgetsContextProvider>
			</CompanyContextProvider>
		</AppContextProvider>
	);
}
