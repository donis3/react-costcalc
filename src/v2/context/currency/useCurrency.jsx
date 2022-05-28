import { useContext } from 'react';
import { CurrencyContext } from '.';
import useSettings from '../settings/useSettings';

export default function useCurrency() {
	const rates = useContext(CurrencyContext); //Load currencies repo
	const { currencies } = useSettings(); //Load active currencies
	const defaultRate = { from: 'ERR', to: currencies.default, change: 0, rate: 1, date: Date.now() };

	const getName = (code) => {
		const names = currencies.getNames();
		if (code in names) {
			return names[code];
		}
		return code;
	};

	const getRate = (code) => {
		const result = { ...defaultRate, from: code };
		if (!code || !currencies?.enabled?.includes(code)) throw new Error('Invalid Currency');
		//No rate data yet
		if (!Array.isArray(rates?.[code]) || rates[code].length === 0) return defaultRate;
		const rate = rates[code][0];
		if (!rate) return result;
		return { ...result, ...rate };
	};

	return { currencies, rates, getName, getRate };
}
