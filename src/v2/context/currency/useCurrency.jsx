import React, { useContext } from 'react';
import { CurrencyContext } from '.';
import useSettings from '../settings/useSettings';

export default function useCurrency() {
	const rates = useContext(CurrencyContext); //Load currencies repo
	const { currencies } = useSettings(); //Load active currencies

	console.log('TODO: Create use currency');
	return { currencies, rates };
}
