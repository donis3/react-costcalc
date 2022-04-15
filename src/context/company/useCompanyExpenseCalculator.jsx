import useConfig from '../../hooks/app/useConfig';
import useCurrencyConversion from '../../hooks/app/useCurrencyConversion';
import useCompanyDefaults from './useCompanyDefaults';

/**
 * Calculating expense cost values for each configured time period.
 * For example, a monthly rent expense will be calculated as cost per day, week, year etc
 * @returns {object} calculateCost & defaultCost
 */
export default function useCompanyExpenseCalculator() {
	const { convert, defaultCurrency, enabledCurrencies } = useCurrencyConversion();
	const { periods } = useCompanyDefaults();
	const config = useConfig();
	//Year, month, week, day, hour
	const periodCoefficients = {
		y: 1,
		m: 12,
		w: 365 / 7,
		d: 365,
		h: 365 * 24,
	};

	/**
	 * Generates an object with every period as keys
	 * and amount & amountWithTax values for each period
	 * @param {float} annualCost Cost per year
	 * @param {float} annualCostWithTax Cost with tax per year
	 * @returns cost object
	 */
	const generateResultObject = (annualCost, annualCostWithTax, currency) => {
		return periods.reduce((acc, key) => {
			if (key in periodCoefficients === false) {
				onError('Invalid Period in obj generation - ' + key);
				return acc;
			}
			const coefficient = periodCoefficients[key];

			//convert from annual to this period by dividing with coefficient
			const periodAmounts = {
				currency,
				amount: annualCost / coefficient,
				amountWithTax: annualCostWithTax / coefficient,
			};
			return { ...acc, [key]: periodAmounts };
		}, {});
	};

	//Debug method
	const onError = (code) => {
		if (!config.get('debug.expenses')) return null;
		console.log(`Expense cost calculation failed: ${code}`);
		return null;
	};

	/**
	 * Calculate cost for each period for given expense
	 * @param {*} data
	 * @returns null if fails, object if success
	 */
	const calculateCost = (data = null, convertToLocal = true) => {
		//Validations
		if (!data || 'period' in data === false) return onError('invalid data');
		let { period, price, quantity, currency, tax } = data;
		price = isNaN(parseFloat(price)) ? 0 : parseFloat(price);
		quantity = isNaN(parseFloat(quantity)) ? 0 : parseFloat(quantity);
		tax = isNaN(parseFloat(tax)) ? 0 : parseFloat(tax);

		if (!periods.includes(period)) return onError('invalid period - ' + period);
		if (period in periodCoefficients === false) return onError('Period conversion missing for ' + period);

		if (![...enabledCurrencies, defaultCurrency].includes(currency)) return onError('invalid currency - ' + currency);

		let amount = 0;
		let amountWithTax = 0;

		//Calculate cost
		if (convertToLocal) {
			let localPrice = currency === defaultCurrency ? price : convert(price, currency).amount;
			if (isNaN(localPrice)) localPrice = 0;
			amount = localPrice * quantity;
			amountWithTax = amount * (1 + tax / 100);
		} else {
			amount = price * quantity;
			amountWithTax = amount * (1 + tax / 100);
		}

		//Period coefficient will convert a cost to annual cost
		const periodX = periodCoefficients[period];
		const annualAmount = amount * periodX;
		const annualAmountWithTax = amountWithTax * periodX;

		//Calc cost for each period
		return generateResultObject(annualAmount, annualAmountWithTax, convertToLocal ? defaultCurrency : currency);
	};

	//Exports
	return {
		calculateCost,
		defaultCost: calculateCost({ period: periods[0], price: 0, quantity: 0, currency: defaultCurrency, tax: 0 }),
	};
}
