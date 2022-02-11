import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nextOptions } from '../config/i18n';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init(i18nextOptions);

export default i18n;
