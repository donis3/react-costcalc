import { useContext } from 'react';
import { CurrencyContext } from '.';
import useSettings from '../settings/useSettings';

export default function useCurrency() {
	const rates = useContext(CurrencyContext); //Load currencies repo
	const { currencies } = useSettings(); //Load active currencies

	const getName = (code) => {
		const names = currencies.getNames();
		if (code in names) {
			return names[code];
		}
		return code;
	};

	return { currencies, rates, getName };
}
