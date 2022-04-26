import useCompanyDefaults from '../../context/company/useCompanyDefaults';
import useWidgetsDefaults from '../../context/widgets/useWidgetsDefaults';
import useConfig from './useConfig';
import { generateInitialData as currencyDefaultGenerator } from './useCurrency';

export default function useApplicationDefaults() {
	const defaultData = {};
	const config = useConfig();
	const { defaultCompany } = useCompanyDefaults();
	const { defaultWidgetsData } = useWidgetsDefaults();

	//Get default currency data
	const defaultCurrency = config.getDefaultCurrency(true);
	const enabledCurrencies = config.getCurrenciesArray({ exclude: defaultCurrency });
	defaultData.currencies = currencyDefaultGenerator(defaultCurrency, enabledCurrencies);

	//Get default company data
	defaultData.company = defaultCompany;

	//Get widgets data
	defaultData.widgets = defaultWidgetsData;

	//Rest are empty arrays
	defaultData.endproducts = [];
	defaultData.materials = [];
	defaultData.packages = [];
	defaultData.products = [];
	defaultData.recipes = [];

	return defaultData;
}
