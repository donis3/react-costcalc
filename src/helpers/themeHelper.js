import config from '../config/config.json';

export const changeTheme = ( themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    saveThemeSelection(themeName);
};

export const getCurrentTheme = () => {
    return document.documentElement.getAttribute('data-theme');
}



export const saveThemeSelection = (themeName) => {
    localStorage.setItem('activeTheme', themeName);
}

//Load saved theme selection OR default
export const loadThemeFromStorage = () => {
    const savedTheme = localStorage.getItem('activeTheme');
    const result = config.themes.find(item => item === savedTheme);
    if(result) {
        config.debug.themeHelper && console.log(`Loading theme ${result} from local storage`);
        changeTheme(result);
    }
}