import React from 'react';
import { AppContextProvider } from './context/AppContext';
import CompanyContextProvider from './context/CompanyContext';
import MainContext from './context/MainContext';
import MordersContextProvider from './context/MordersContext';
import WidgetsContextProvider from './context/WidgetsContext';

export default function ContextWrapper({ children }) {
	return (
		<AppContextProvider>
			<CompanyContextProvider>
				<MordersContextProvider>
					<WidgetsContextProvider>
						<MainContext>
							{/* Main Context has all application contexts in it */}
							{children}
						</MainContext>
					</WidgetsContextProvider>
				</MordersContextProvider>
			</CompanyContextProvider>
		</AppContextProvider>
	);
}
