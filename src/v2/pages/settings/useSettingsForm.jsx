import { useMemo, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import useConfig from '../../hooks/app/useConfig';
import currency from '../../config/currency.json';
import { useTranslation } from 'react-i18next';
import { sortArrayAlphabetic } from '../../lib/common';
import useFormBuilder from '../../hooks/forms/useFormBuilder';
import { SettingsDispatchContext } from '../../context/settings';

const initialState = {
	api: '',
	apiKey: '',
	defaultCurrency: '',
	currencies: [],
};

export default function useSettingsForm({ data = null }) {
	const config = useConfig();
	const availableApis = config.all?.apiProviders || [];
	const showApiSection = availableApis.length > 0;
	const currencyCodes = Object.keys(currency);
	const { t } = useTranslation('pages/settings');
	const { t: currencyTranslator, i18n } = useTranslation('currencies');
	const [isSubmitted, setIsSubmitted] = useState(false);
	const dispatch = useContext(SettingsDispatchContext);

	//Generate initial data
	if (data) {
		if (data?.defaultCurrency) initialState.defaultCurrency = data.defaultCurrency;
		if (data?.currencies && Array.isArray(data.currencies)) initialState.currencies = data.currencies;
		if (initialState.currencies.includes(initialState.defaultCurrency)) {
			initialState.currencies = initialState.currencies.filter((c) => c !== initialState.defaultCurrency);
		}
		if (data?.apiProvider) initialState.api = data.apiProvider;
		if (data?.apiKey) initialState.apiKey = data.apiKey;
	}

	//Load form builder
	const { schema, joi, register, getError, handleChange, getFormData, resetForm, formState, setState } = useFormBuilder(
		{
			initialState,
			isSubmitted,
		}
	);

	//=================// Select Arrays //=====================//
	const select = {
		defaultCurrency: [],
		currencies: [{ name: t('form.defaultCurrencyRequired'), value: '', disabled: true }],
		api: [],
	};

	const allCurrencies = useMemo(() => {
		let data = Object.keys(currency).reduce((acc, key) => {
			let { name, symbol } = currency[key];

			//Localize currency if exists
			if (i18n.exists(key, { ns: 'currencies' })) {
				name = currencyTranslator(key);
			}

			return [...acc, { name: `${name} (${symbol})`, value: key }];
		}, []);
		data = sortArrayAlphabetic(data, 'name');
		return data;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [i18n, currencyTranslator]);
	const defaultCurrencyName = allCurrencies.find((cur) => cur.value === formState.defaultCurrency)?.name;

	function getAvailableCurrencies(allCurrencies, selectedCurrencies = [], defaultCurrency = '') {
		const selectDefaultCurrencyItem = { name: t('form.defaultCurrencyRequired'), value: '', disabled: true };
		if (!Array.isArray(allCurrencies) || allCurrencies.length === 0) return [];
		if (defaultCurrency in currency === false) return [selectDefaultCurrencyItem];

		return allCurrencies.reduce((acc, item) => {
			const { name, value } = item;
			if (value === defaultCurrency) return acc; //filter default
			let text = name;
			if (selectedCurrencies.includes(value)) {
				text = `✔ ${text} `;
			}
			return [...acc, { name: text, value: value }];
		}, []);
	}

	//Generate the select arrays for default currency & available currencies. (filter default currency out)
	select.defaultCurrency = [{ name: t('form.defaultCurrencySelect'), value: '', disabled: true }, ...allCurrencies];
	select.currencies = getAvailableCurrencies(allCurrencies, formState.currencies, formState.defaultCurrency);

	//Remote Api's
	select.api = availableApis.map((provider) => ({ name: provider.name, value: provider.id }));
	select.api.unshift({ name: t('form.noRemoteService'), value: '' });

	//=================// Actions //=====================//
	const addCurrency = (cur) => {
		if (cur in currency === false) return;
		if (formState.defaultCurrency === cur) return;
		const newCurrenciesArray = [...formState.currencies.filter((c) => c !== cur), cur];
		newCurrenciesArray.sort();
		setState('currencies', newCurrenciesArray);
	};
	const removeCurrency = (cur) => {
		if (!cur) return;
		setState('currencies', [...formState.currencies.filter((c) => c !== cur)]);
	};

	const onCurrencySelect = (currencyCode) => {
		if (!currencyCode || currencyCode in currency === false) return;
		if (formState.currencies.includes(currencyCode)) {
			removeCurrency(currencyCode);
		} else {
			addCurrency(currencyCode);
		}
	};

	/**
	 * When default currency changes, remove it from selected currencies
	 */
	handleChange('defaultCurrency', (cur) => {
		if (formState?.currencies?.includes(cur)) {
			const newCurrenciesState = formState.currencies.filter((c) => c !== cur);
			setState('currencies', newCurrenciesState);
		}
	});

	//=================// Api Handling//=====================//

	const currentApi = availableApis.find((api) => api.id === formState.api);
	const isApiKeyDisabled = currentApi?.requiresKey === true ? false : true;

	//=================// Schema //=====================//
	schema.api = joi.string().min(0).label(t('form.api'));
	schema.apiKey = joi
		.string()
		.min(isApiKeyDisabled ? 0 : 1)
		.label(t('form.apiKey'));
	schema.defaultCurrency = joi
		.string()
		.uppercase()
		.min(2)
		.label(t('form.defaultCurrency'))
		.valid(...currencyCodes);

	schema.currencies = joi
		.array()
		.items(joi.string().valid(...currencyCodes))
		.min(0)
		.label(t('form.selectedCurrencies'));

	//=================// Form Actions //=====================//
	function handleSubmit() {
		if (!dispatch) return;
		const success = () => toast.success(t('form.success'), { toastId: 'settings' });
		const error = (code) => toast.error(t('form.error', { code }), { toastId: 'settings' });
		try {
			const data = getFormData(true);
			const payload = {
				defaultCurrency: data.defaultCurrency,
				apiKey: data.apiKey,
				apiProvider: data.api,
				currencies: data.currencies,
			};

			const action = {
				type: 'SaveSettings',
				payload: payload,
				success,
				error,
			};
			dispatch(action);
		} catch (err) {
			//Form errors.
		}
	}

	function handleReset() {
		resetForm();
	}

	//=================// Exports //=====================//
	return {
		formState,
		showApiSection,
		isApiKeyDisabled,
		select,
		register,
		getError,
		defaultCurrencyName,
		actions: {
			onCurrencySelect,
			setIsSubmitted,
			removeCurrency,
			handleSubmit,
			handleReset,
		},
	};
}
