import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import { formatISO } from 'date-fns';

export default function useCompanyDefaults() {
	const { t } = useTranslation('pages/company');
	const config = useConfig();

	//Definitions
	const departments = config.get('company.departments') || [];

	const defaultCurrency = config.getDefaultCurrency(true);
	const periods = ['y', 'm', 'w', 'd', 'h'];
	const units = ['t', 'kwh', 'kg', 'L', 'pcs', 'other'];
	const periodCoefficients = {
		y: 1,
		m: 12,
		w: 365 / 7,
		d: 365,
		h: 365 * 24,
	};
	//Localization in pages/company
	const expenseCategories = [
		'advertisement',
		'banking',
		'government',
		'legal',
		'insurance',
		'maintenance',
		'office',
		'utilities',
		'rent',
		'food',
		'gas',
		'depreciation',
		'other',
	];

	const companyInfo = {
		name: t('defaultCompany.name'),
		legalName: t('defaultCompany.legalName'),
		founder: t('defaultCompany.founder'),
		about: t('defaultCompany.about'),
		establishedOn: formatISO(new Date('01/01/2000')),
		address: t('defaultCompany.address'),
		city: t('defaultCompany.city'),
		country: t('defaultCompany.country'),
		phone: '2121000000',
		mobile: '5321000000',
		fax: '2121000000',
		email: t('defaultCompany.email'),
		taxId: '',
		website: t('defaultCompany.website'),
	};

	const employee = {
		employeeId: 0,
		name: '',
		department: departments[0].name,
		notes: '',
		gross: 0,
		net: 0,
		currency: defaultCurrency,
		email: '',
		mobile: '',
		dob: formatISO(new Date('01/01/1987')),
		doe: formatISO(new Date(new Date().getFullYear(), 1, 1)),
	};

	const expense = {
		expenseId: 0,
		name: '',
		category: expenseCategories[0],
		period: periods[0],
		unit: 'pcs',
		quantity: 0,
		price: 0,
		tax: 0,
		currency: defaultCurrency,
		cost: null, //Will be an object with each time period
	};

	const defaultCompany = {
		info: companyInfo,
		expenses: [],
		employees: [],
		totals: {
			currency: defaultCurrency,
			updatedAt: Date.now(),
			expenses: 0,
			expensesWithTax: 0,
			labourNet: 0,
			labourGross: 0,
			//Excluding labour wages
			salariesNet: 0,
			salariesGross: 0,
		},
		production: {
			updatedAt: Date.now(),
			unit: config.get('company.defaultProductionUnit'),
			totalProduction: 0,
		},
		history: {
			overhead: [],
			labor: [],
			production: [],
		},
	};

	return {
		defaultCompany,
		defaultExpense: expense,
		defaultEmployee: employee,
		defaultInfo: companyInfo,
		periods,
		periodCoefficients,
		units,
		expenseCategories,
		production: defaultCompany.production,
		totals: defaultCompany.totals,
		history: defaultCompany.history,
	};
}
