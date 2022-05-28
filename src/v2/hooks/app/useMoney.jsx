import useCurrency from '../../context/currency/useCurrency';
import useIntl from '../common/useIntl';

export default function useMoney() {
	const { displayMoney: moneyIntl } = useIntl();
	const { currencies, getRate } = useCurrency();
	const { enabled = [], default: defaultCurrency } = currencies || {};

	if (!defaultCurrency) throw new Error('Error: missing default currency');

	/**
	 * Convert a monetary value between currencies
	 * @param {*} from
	 * @param {*} to
	 */
	const convert = (amount = 0, from = null, to = null, round = true) => {
		const result = { currency: from, amount: amount };
		if (typeof from === 'string') from = from.toUpperCase();
		if (typeof to === 'string') to = to.toUpperCase();

		//Checks
		if (!from || enabled.includes(from) === false) return result;
		if (!to || to === defaultCurrency) {
			to = defaultCurrency;
		} else if (to && enabled.includes(to) === false) {
			return result;
		}
		if (from === to) return result;
		if (amount === 0) return { currency: to, amount: 0 };

		//Convert to default currency
		const rateToDefault = getRate(from)?.rate;
		if (isNaN(parseFloat(rateToDefault))) return result;
		const defaultAmount = parseFloat(amount * rateToDefault);

		//if to is default currency no need for further conversion
		if (to === defaultCurrency) {
			if (round) {
				return { currency: to, amount: Math.round(defaultAmount * 10000) / 10000 };
			} else {
				return { currency: to, amount: defaultAmount };
			}
		}

		//get conversion rate for target currency
		const rateToTarget = getRate(to)?.rate;
		if (isNaN(parseFloat(rateToTarget))) return result;
		//Find amount using   targetRate * amount = defaultAmount
		const targetAmount = parseFloat(defaultAmount / rateToTarget);

		if (round) {
			return { currency: to, amount: Math.round(targetAmount * 10000) / 10000 };
		} else {
			return { currency: to, amount: targetAmount };
		}
	};

	const displayMoney = (amount = null, currency = null, convertTo = null) => {
		if (amount === null || isNaN(parseFloat(amount))) amount = 0;
		let moneyObj = { amount: amount, currency: currency };

		//if currency is not provided, assume its default currency
		if (!currency) {
			moneyObj.currency = defaultCurrency;
		} else if (currency && convertTo) {
			//Conversion needed

			moneyObj = convert(amount, currency, convertTo);
		} else if (currency && !convertTo) {
			//there is a currency provided and no conversion needed
			moneyObj = { amount: amount, currency: currency };
		}

		//display final obj
		return moneyIntl(moneyObj.amount, moneyObj.currency);
	};

	/**
	 * Generate an array for form select currency
	 * @param {*} filter exclude these currencies
	 * @returns
	 */
	const selectCurrencyArray = (filter = []) => {
		const currencyNames = currencies.getNames();
		const currencySymbols = currencies.getSymbols();
		if (typeof filter === 'string') filter = [filter];
		if (!Array.isArray(filter)) filter = [];

		const selectCurrencies = [...currencies.allowed].filter((cur) => !filter.includes(cur));

		return selectCurrencies.reduce((acc, code) => {
			const nameTxt = code in currencyNames ? currencyNames[code] : code;
			let symbol = '';
			if (code in currencySymbols && currencySymbols[code] !== code) {
				symbol = ' (' + currencySymbols[code] + ')';
			}
			const selectItem = {
				name: `${nameTxt}${symbol}`,
				value: code,
			};
			return [...acc, selectItem];
		}, []);
	};

	return { convert, displayMoney, defaultCurrency, enabledCurrencies: enabled, currencies, selectCurrencyArray };
}
