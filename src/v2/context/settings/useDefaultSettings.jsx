import useApp from '../app/useApp';

export default function useDefaultSettings() {
	const { language } = useApp();
	const lang = language ? language.code : 'tr';
	const defaultSettings = {
		currencies: lang === 'tr' ? ['USD', 'EUR'] : [],
		favoriteCurrencies: lang === 'tr' ? ['USD', 'EUR'] : [],
		defaultCurrency: lang === 'tr' ? 'TRY' : 'USD',
		apiProvider: '',
		apiKey: '',
		updatedAt: null,
		analytics: false,
		//Version
		v: process.env.REACT_APP_VERSION,
		//Toggles
		setupComplete: false,
		isDemo: false,
	};

	return { initialData: defaultSettings };
}
