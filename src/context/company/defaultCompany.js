import config from '../../config/config.json';
import { formatISO } from 'date-fns';

const departments = config.company.departments.map((item) => item.name);
const categories = config.company.expenseCategories;
const defaultCurrencyObj = config.applicationData.currencies.find((item) => item.default === true);
const defaultCurrency = defaultCurrencyObj?.code || 'TRY';

const defaultCompany = {
	info: {
		name: 'Dream Incorporated.',
		legalName: 'Dreams Manufacturing Dreams LLC - Cayman Islands',
		founder: 'John Doe',
		about: 'About the company...',
		establishedOn: formatISO(new Date('01/01/2000')),
		address: 'Central Avenue No:1',
		city: 'Istanbul',
		country: 'Turkiye',
		phone: '2121000000',
		mobile: '5321000000',
		fax: '2121000000',
		email: 'company@example.com',
		taxId: '',
		website: 'www.company.com',
	},
	overhead: [
		{
			name: 'Sticky Tape',
			category: categories[0],
			period: 'year',
			unit: 'pcs',
			quantity: 100,
			price: 10,
			tax: 18,
			currency: defaultCurrency,
		},
	],
	employees: [
		{
			name: 'John Doe',
			department: departments[0],
			notes: '',
			gross: 5879 * 12,
			net: 4250 * 12,
			currency: defaultCurrency,
		},
	],
	totals: {
		overhead: 0,
		overheadWithTax: 0,
		wagesNet: 0,
		wagesGross: 0,
	},
};

export default defaultCompany;
