import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWindowType from '../hooks/useWindowType';
import { getLangDetails } from '../helpers/languages';
import { getCurrentTheme, setCurrentTheme, getAllThemes } from '../helpers/themeHelper';
import config from '../config/config.json';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
	//Window size context
	const { windowType } = useWindowType();

	//Language Context
	const { i18n } = useTranslation();
	const langDetails = getLangDetails(i18n.language);
	const allLanguages = config.languages.map((languageCode) => getLangDetails(languageCode));
	const handleLanguageChange = (newLanguage) => {
		config.debug.stateChange && console.log(`AppContext: lang changed to  ${newLanguage}`);
		i18n.changeLanguage(newLanguage);
	};

	//Theme Context
	const [theme, setTheme] = useState(getCurrentTheme);
	const handleChangeTheme = (newTheme) => {
		
		const result = setCurrentTheme(newTheme);
		if (result) {
			config.debug.stateChange && console.log(`AppContext: theme changed to ${result}`);
			setTheme(result);
		}
	};

	//Payload
	const contextValues = {
		//Window type to determine width. (sm,md,lg,xl)
		windowType,
		//Active language {all, change, code, countryCode, name, nativeName}
		language: {
			all: allLanguages,
			change: handleLanguageChange,
			...langDetails,
		},
		//Themes
		theme: {
			active: theme,
			change: handleChangeTheme,
			all: getAllThemes(),
		},
	};

	return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>;
};

export default AppContext;
export { AppContextProvider };
