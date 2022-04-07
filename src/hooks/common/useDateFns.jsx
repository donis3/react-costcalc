import { format, isValid, parse, parseISO } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import { tr, enUS } from 'date-fns/locale';

//country code => localeObject
const preloaded = { en: enUS, tr: tr };

export default function useDateFns() {
	const { language } = useAppContext();
	const datePickerFormat = 'dd-MM-yyyy';
	const datePickerJoiFormat = 'D-M-Y';

	//Load locale for given language
	let dateLocale = enUS;
	if (Object.keys(preloaded).includes(language.code)) {
		dateLocale = preloaded[language.code];
	} else {
		console.log(
			`Trying to load ${language.code} locale for date-fns without importing it. Please import all required locales in useDateFns hook.`
		);
	}

	function getLocaleOptions() {
		if (dateLocale && typeof dateLocale === 'object' && 'localize' in dateLocale) {
			return { locale: dateLocale };
		} else {
			return {};
		}
	}

	return {
		format: (date, formatStr = 'P', options = {}) => {
			return format(date, formatStr, { ...options, ...getLocaleOptions() });
		},
		isValid,
		parse: (dateString, formatString = 'P', referenceDate, options = {}) => {
			return parse(dateString, formatString, referenceDate, { ...options, ...getLocaleOptions() });
		},
		parseISO,
		datePickerFormat,
		datePickerJoiFormat,
		locale: dateLocale,
	};
}
