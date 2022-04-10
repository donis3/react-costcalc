import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import { formatISO } from 'date-fns';

export default function useCompanyDefaults() {
	const { t } = useTranslation('pages/company');
	const config = useConfig();

	//Definitions
	const departments = config.get('company.departments') || [];
	const expenseCategories = config.get('company.expenseCategories');
	const defaultCurrency = config.getDefaultCurrency(true);
	const periods = ['y', 'm', 'd', 'w'];

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
	};

	const defaultCompany = {
		info: companyInfo,
		overhead: [],
		employees: [],
		totals: {
			overhead: 0,
			overheadWithTax: 0,
			wagesNet: 0,
			wagesGross: 0,
		},
	};

	return {
		defaultCompany,
		defaultExpense: expense,
		defaultEmployee: employee,
		defaultInfo: companyInfo,
		periods,
	};
}
