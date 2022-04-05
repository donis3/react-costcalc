import config from '../../config/config.json';

const departments = ['manufacturing', 'pr', 'cr', 'marketing', 'hr', 'it', 'management', 'other'];
const categories = ['officeSupplies', 'repairs', 'utilities', 'other'];
const defaultCurrencyObj = config.applicationData.currencies.find((item) => item.default === true);
const defaultCurrency = defaultCurrencyObj?.code || 'TRY';

const defaultCompany = {
	info: {
		name: 'Dream Incorporated.',
		founder: 'John Doe',
		about: 'About the company...',
		establishedOn: new Date('01/01/2000').getTime(),
		address: 'Central Avenue No:1',
		city: 'Istanbul',
		country: 'Turkiye',
		lat: 41.013043,
		long: 28.952883,
		phone: '2121000000',
		mobile: '5321000000',
		fax: '2121000000',
		email: 'company@example.com',
		taxId: '',
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
			salary: 50000,
			currency: defaultCurrency,
		},
	],
};

export default defaultCompany;
