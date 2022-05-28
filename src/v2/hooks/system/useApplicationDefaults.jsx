import useCompanyDefaults from '../../context/company/useCompanyDefaults';
import useDefaultSettings from '../../context/settings/useDefaultSettings';
import useWidgetsDefaults from '../../context/widgets/useWidgetsDefaults';

import useMoney from '../app/useMoney';

export default function useApplicationDefaults() {
	const defaultData = {};
	const { defaultCompany } = useCompanyDefaults();
	const { defaultWidgetsData } = useWidgetsDefaults();

	//Get default currency data
	const { enabledCurrencies } = useMoney();
	defaultData.currencies = enabledCurrencies.reduce((acc, cur) => {
		return { ...acc, [cur]: [] };
	}, {});

	//Get default company data
	defaultData.company = defaultCompany;

	//Get widgets data
	defaultData.widgets = defaultWidgetsData;

	//Get default settings
	const settingsData = useDefaultSettings();
	defaultData.settings = settingsData.initialData;

	//Rest are empty arrays
	defaultData.endproducts = [];
	defaultData.materials = [];
	defaultData.packages = [];
	defaultData.products = [];
	defaultData.recipes = [];

	return defaultData;
}
