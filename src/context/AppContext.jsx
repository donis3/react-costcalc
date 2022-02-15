import React, { createContext } from 'react';
import useWindowType from '../hooks/useWindowType';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
	const { windowType } = useWindowType();

	return <AppContext.Provider value={{ windowType }}>{children}</AppContext.Provider>;
};

export default AppContext;
export { AppContextProvider };
