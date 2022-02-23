import config from './config.json';


const backendOptions = {
	loadPath: '/locales/{{lng}}/{{ns}}.json',
	addPath: '/locales/{{lng}}/pages/{{ns}}',
	
};

const detectionOptions = {
	// order and from where user language should be detected
	order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

	// keys or params to lookup language from
	lookupQuerystring: 'lng',
	lookupCookie: 'i18next',
	lookupLocalStorage: 'i18nextLng',
	lookupSessionStorage: 'i18nextLng',
	lookupFromPathIndex: 0,
	lookupFromSubdomainIndex: 0,

	// cache user language on
	//caches: ['localStorage', 'cookie'],
	caches: ['localStorage'],
	excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

	// optional expire and domain for set cookie
	// cookieMinutes: 10,
	// cookieDomain: 'myDomain',

	// optional htmlTag with lang attribute, the default is:
	htmlTag: document.documentElement,

	// optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
	cookieOptions: { path: '/', sameSite: 'strict' },
};

export const i18nextOptions = {
	fallbackLng: {
		default: ['en'],
		en: ['en'],
		'en-US': ['en'],
		'tr-TR': ['tr'],
	},

	supportedLngs: ['tr', 'en'],
	nonExplicitSupportedLngs: false,
	ns: ['translation', 'joi'],
	defaultNS: 'translation',
	debug: config.debug?.i18next,
	backend: backendOptions, //http backend plugin options
	detection: detectionOptions, //lang detector options
	interpolation: {
		escapeValue: false, // not needed for react as it escapes by default
	},
};
