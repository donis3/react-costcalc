import {
	format,
	isValid,
	parse,
	parseISO,
	formatISO,
	formatDistance,
	differenceInYears,
	formatDistanceStrict,
} from 'date-fns';

import { tr, enUS } from 'date-fns/locale';
import useApp from '../../context/app/useApp';

//country code => localeObject
const preloaded = { en: enUS, tr: tr };

export default function useDateFns() {
	const { language } = useApp();
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

	function optionsWithLocale(options = null) {
		if (options && typeof options === 'object') {
			return { ...getLocaleOptions(), ...options };
		} else {
			return getLocaleOptions();
		}
	}

	function parseDate(date = null, defaultValue = null) {
		if (!date) return defaultValue;
		if (date instanceof Date && isValid(date)) return date;
		if (isValid(parse(date, datePickerFormat, new Date()))) {
			return parse(date, datePickerFormat, new Date());
		}
		if (isValid(parseISO(date))) {
			return parseISO(date);
		}
		return defaultValue;
	}

	function timeSince(startingDate, endDate = null, options = null) {
		//Try to parse starting and end date
		startingDate = parseDate(startingDate);
		endDate = parseDate(endDate, new Date());

		//Validate startingDate
		if (!startingDate) return null;

		//Generate options and locale
		const defaultOptions = { includeSeconds: false, addSuffix: true };
		const opts = optionsWithLocale(options || defaultOptions);

		if (opts?.strict === true) {
			return formatDistanceStrict(startingDate, endDate, opts);
		}
		return formatDistance(startingDate, endDate, opts);
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
		formatISO,
		timeSince,
		datePickerFormat,
		datePickerJoiFormat,
		locale: dateLocale,
		getAge: (birthday) => differenceInYears(Date.now(), parseDate(birthday)),
	};
}
