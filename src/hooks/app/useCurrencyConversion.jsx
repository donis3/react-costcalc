import useIntl from '../common/useIntl';
import useCurrency from './useCurrency';

export default function useCurrencyConversion() {
	const {
		currencies: { defaultCurrency, enabledCurrencies, getCurrentRate },
	} = useCurrency();
	const { displayMoney: moneyIntl } = useIntl();

	

	/**
	 * Convert a monetary value between currencies
	 * @param {*} from
	 * @param {*} to
	 */
	const convert = (amount = 0, from = null, to = null) => {
		const result = { currency: from, amount: amount };

		if (typeof from === 'string') from = from.toUpperCase();
		if (typeof to === 'string') to = to.toUpperCase();
		//Checks
		if (!from || enabledCurrencies.includes(from) === false) return result;
		if (!to || to === defaultCurrency) {
			to = defaultCurrency;
		} else if (to && enabledCurrencies.includes(to) === false) {
			return result;
		}
		if (from === to) return result;
		if (amount === 0) return { currency: to, amount: 0 };

		//Convert to default currency
		const rateToDefault = getCurrentRate(from);
		if (isNaN(parseFloat(rateToDefault))) return result;
		const defaultAmount = parseFloat(amount * rateToDefault);

		//if to is default currency no need for further conversion
		if (to === defaultCurrency) {
			return { currency: to, amount: Math.round(defaultAmount * 100) / 100 };
		}

		//get conversion rate for target currency
		const rateToTarget = getCurrentRate(to);
		if (isNaN(parseFloat(rateToTarget))) return result;
		//Find amount using   targetRate * amount = defaultAmount
		const targetAmount = parseFloat(defaultAmount / rateToTarget);

		return { currency: to, amount: Math.round(targetAmount * 100) / 100 };
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

	return { convert, displayMoney, defaultCurrency, enabledCurrencies };
}
