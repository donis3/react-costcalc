import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWindowType from '../../hooks/common/useWindowType';
import { getLangDetails } from '../../helpers/languages';
import { getCurrentTheme, setCurrentTheme, getAllThemes } from '../../helpers/themeHelper';
import config from '../../config/config.json';

//Infer locale like tr_TR through country code
import { LocaleHelpers } from 'locale-helpers';
import { useLocation } from 'react-router-dom';

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
		document.documentElement.setAttribute('lang', newLanguage);
	};
	//Calculate locale
	//Will get a locale like tr_TR
	let localeString = LocaleHelpers.bestLocaleFor({ language: langDetails.code, country: langDetails.code });
	//replace _ with -
	localeString = localeString.replace('_', '-');
	try {
		const validLocales = Intl.getCanonicalLocales(localeString);
		if (validLocales.length > 0) {
			localeString = validLocales[0];
		}
	} catch (err) {
		localeString = 'en-US';
	}

	//Theme Context
	const [theme, setTheme] = useState(getCurrentTheme);
	const handleChangeTheme = (newTheme) => {
		console.log(newTheme);
		const result = setCurrentTheme(newTheme);
		if (result) {
			config.debug.stateChange && console.log(`AppContext: theme changed to ${result}`);
			setTheme(result);
		}
	};

	//Page context for page name, title etc
	const { pathname } = useLocation();
	const [lastBreadcrumb, setLastBreadcrumb] = useState({});
	//Must be used in useEffect with pathname dependency or will cause too many renders
	const setBreadcrumb = (text = '') => {
		if (!text || typeof text !== 'string') text = '';
		const newBreadcrumb = text;
		setLastBreadcrumb({ ...lastBreadcrumb, [pathname]: newBreadcrumb });
	};
	const getBreadcrumb = (pathname) => {
		if (pathname in lastBreadcrumb) return lastBreadcrumb[pathname];
		return null;
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
			locale: localeString,
		},
		//Themes
		theme: {
			active: theme,
			change: handleChangeTheme,
			all: getAllThemes(),
		},
		//Page context
		page: { setBreadcrumb, getBreadcrumb },
	};

	//Set html tag lang
	document.documentElement.setAttribute('lang', langDetails.code);

	return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>;
};

export default AppContext;
export { AppContextProvider };
