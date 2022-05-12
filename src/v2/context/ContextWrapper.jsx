import React from 'react';
import { AppContextProvider } from './app';

export default function ContextWrapper({ children }) {
	return <AppContextProvider>{children}</AppContextProvider>;
}
