import config from '../config/config.json';

export const setCurrentTheme = (themeName) => {
	const result = config.themes.find((item) => item === themeName);
	if (!result) {
        console.log(`Theme change failed. ${themeName} must be set in config.`);
		return false;
	}
	document.documentElement.setAttribute('data-theme', themeName);
	saveThemeSelection(themeName);
    return themeName;
};

export const getCurrentTheme = () => {
	return document.documentElement.getAttribute('data-theme');
};

export const saveThemeSelection = (themeName) => {
	localStorage.setItem('activeTheme', themeName);
};

export const getAllThemes = () => {
    return config.themes;
}

//Load saved theme selection OR default
export const loadThemeFromStorage = () => {
	const savedTheme = localStorage.getItem('activeTheme');
	const result = config.themes.find((item) => item === savedTheme);
	if (result) {
		config.debug.themeHelper && console.log(`Loading theme ${result} from local storage`);
		setCurrentTheme(result);
	}
};
