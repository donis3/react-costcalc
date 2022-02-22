import units from '../data/units.json';
import currencies from '../data/currencies.json';

import { useTranslation } from 'react-i18next';

export function useFormHelper() {
	const { t } = useTranslation('translation');

	/* ------------ Mass & Volume Unit Helpers ------------- */

	//Generate array for FormInput.Select
	const selectUnitArray = (mass = true, volume = true) => {
		const arrayOfUnits = [];
		//Function to grab a unit from json and prepare it for options array
		const getUnitAsOption = (unit) => {
			return {
				//Localized Name
				name: t(`units.${unit.name}`, { count: 1 }),
				//Original unit as value
				value: unit.name,
			};
		};
		//Include category names as disabled options
		if (mass === true && volume === true) {
			arrayOfUnits.push({ name: t('units.mass'), value: null, disabled: true });
		}
		//Include mass
		if (mass === true) {
			units.mass.forEach((unit) => {
				arrayOfUnits.push(getUnitAsOption(unit));
			});
		}

		//Include category name
		if (mass === true && volume === true) {
			arrayOfUnits.push({ name: t('units.volume'), value: null, disabled: true });
		}
		//Include volume
		if (volume === true) {
			units.volume.forEach((unit) => {
				arrayOfUnits.push(getUnitAsOption(unit));
			});
		}
		//Generate unit select html

		return arrayOfUnits;
	};

	//Check if a unit is a mass unit
	const isMassUnit = (unitName) => {
		if (units.mass.find((item) => item.name === unitName)) {
			return true;
		}
		return false;
	};

	/* --------------- MONEY & CURRENCY HELPERS ---------------- */
	const priceWithTax = (price, tax) => {
		tax = parseFloat(tax);
		price = parseFloat(price);
		if (isNaN(price) || isNaN(tax)) {
			//console.warn('Price Calculation: Invalid price or tax percentage supplied');
			return '';
		}

		return price + price * (tax / 100);
	};

	const selectCurrencyArray = (longNames = true, symbols = true) => {
		const arrayOfCurrencies = [];

		currencies.forEach((currency) => {
			const result = {
				name: currency.code,
				value: currency.code,
				disabled: currency.disabled,
			};

			if (longNames === true) {
				result.name = t(`currency.${currency.code}`);
				if (symbols) {
					result.name += ` (${currency.symbol})`;
				}
			} else if (symbols === true) {
				result.name = currency.symbol;
			}

			arrayOfCurrencies.push(result);
		});

		return arrayOfCurrencies;
	};

	return { selectUnitArray, isMassUnit, priceWithTax, selectCurrencyArray };
}
