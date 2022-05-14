import useApp from '../app/useApp';

export default function useDefaultSettings() {
	const { language } = useApp();
	const lang = language ? language.code : 'tr';
	const defaultSettings = {
		currencies: lang === 'tr' ? ['USD', 'EUR'] : [],
		defaultCurrency: lang === 'tr' ? 'TRY' : 'USD',
		apiProvider: '',
		apiKey: '',
		setupComplete: false,
	};

	return { initialData: defaultSettings };
}
