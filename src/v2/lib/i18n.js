import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nextOptions } from '../config/i18n';

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init(i18nextOptions);

// after i18next.init(options);
i18n.services.formatter.add('lowercase', (value, lng, options) => {
	return value.toLowerCase();
});
i18n.services.formatter.add('capitalize', (value, lng, options) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
});
i18n.services.formatter.add('underscore', (value, lng, options) => {
	return value.replace(/\s+/g, '_');
});

i18n.services.formatter.add('truncate', (value, lng, { maxLength = 1, dots = true }) => {
	if (!maxLength || isNaN(parseInt(maxLength))) return value;
	maxLength = parseInt(maxLength);
	if (value.length <= maxLength) {
		return value;
	} else {
		const substr = value.substring(0, maxLength);
		return dots === true ? substr + '...' : substr;
	}
});
// export default i18n;
// export const t = i18n.t;
