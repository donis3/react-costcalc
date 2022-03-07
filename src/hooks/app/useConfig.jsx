import { useTranslation } from 'react-i18next';
import config from '../../config/config.json';

//TODO
export default function useConfig() {
	const { t } = useTranslation('translation');
	return new Config(config, t);
}

//==========================================//
//Define Class
class Config {
	//Data storage
	configData = {};
	t = null;
	//Constructor
	constructor(data, t) {
		if (data || typeof data === 'object' || Object.keys(data).length > 0) {
			this.configData = data;
		}
		if (typeof t === 'function') {
			this.t = t;
		}
	}

	//Get the whole config data object
	get all() {
		return this.configData;
	}

	//Get specific field. Can use config.get('deep.index.value');
	get(name = null) {
		if (!name) return null;
		if (typeof name !== 'string') return null;
		return getDeepValue(this.configData, name);
	}

	//===================| CURRENCIES |=======================//
	checkCurrencies() {
		if (!this.configData?.applicationData?.currencies) return false;
		if (!Array.isArray(this.configData.applicationData.currencies)) return false;
		if (this.configData.applicationData.currencies.length === 0) return false;
		return true;
	}

	getCurrencies(onlyEnabled = true) {
		if (!this.checkCurrencies()) return [];

		return this.configData.applicationData.currencies.reduce((accumulator, current) => {
			//Invalid data
			if (typeof current !== 'object' || Object.keys(current).length === 0) {
				return accumulator;
			}
			if (!onlyEnabled || (onlyEnabled === true && current.disabled === false)) {
				return [...accumulator, current];
			} else {
				return accumulator;
			}
		}, []);
	}

	getDefaultCurrency(returnCode = false) {
		if (!this.checkCurrencies()) return null;
		const result = this.configData.applicationData.currencies.find((item) => item.default === true);
		if (!result) {
			console.warn('Config missing default currency');
		}
		if (!returnCode) return result;
		else {
			return result.code;
		}
	}

	//get currency code array
	getCurrenciesArray({ exclude = [] } = {}) {
		if (!this.checkCurrencies()) return [];
		//Nothing to exclude
		if (!exclude || exclude === []) {
			return this.getCurrencies(true).map((item) => item.code);
		}
		const result = [];
		this.getCurrencies(true).forEach((item) => {
			if (Array.isArray(exclude) && exclude.includes(item.code)) {
				//Skip
				return;
			}
			if (typeof exclude === 'string' && exclude === item.code) {
				//Skip
				return;
			}
			result.push(item.code);
		});
		return result;
	}

	getLocalizedCurrencies({ longNames = true, symbols = false, showOnlyEnabledCurrencies = true }) {
		const currencies = this.getCurrencies(showOnlyEnabledCurrencies);
		const arrayOfCurrencies = [];

		currencies.forEach((currency) => {
			const result = {
				name: currency.code,
				value: currency.code,
				disabled: currency.disabled,
			};

			if (longNames === true) {
				result.name = this.t(`currency.${currency.code}`);
				if (symbols) {
					result.name += ` (${currency.symbol})`;
				}
			} else if (symbols === true) {
				result.name = currency.symbol;
			}

			arrayOfCurrencies.push(result);
		});

		return arrayOfCurrencies;
	}

	//return symbol if found or code if not
	getCurrencySymbol(code = null) {
		const currencies = this.getCurrencies(false);
		if (!currencies || Array.isArray(currencies) === false || code === null) return code;

		const result = currencies.find((cur) => cur.code === code.toUpperCase());
		return result ? result.symbol : code;
	}

	//===================| UNITS |=======================//

	getLocalizedUnitSelectOptions({ weight = true, volume = true }) {
		const units = { weight: this.getUnits('weight'), volume: this.getUnits('volume') };
		const arrayOfUnits = [];
		//Function to grab a unit from json and prepare it for options array
		const getUnitAsOption = (unit) => {
			return {
				//Localized Name
				name: this.t(`units.${unit.name}`, { count: 1 }),
				//Original unit as value
				value: unit.name,
			};
		};
		//Weight Units
		if (weight === true) {
			arrayOfUnits.push({ name: this.t('units.mass'), value: null, disabled: true });
			units.weight.forEach((item) => {
				arrayOfUnits.push(getUnitAsOption(item));
			});
		}
		//Volume Units
		if (volume === true) {
			arrayOfUnits.push({ name: this.t('units.volume'), value: null, disabled: true });
			units.volume.forEach((item) => {
				arrayOfUnits.push(getUnitAsOption(item));
			});
		}

		return arrayOfUnits;
	}

	checkUnits() {
		if (!this.configData?.applicationData?.units) return false;
		if (!Array.isArray(this.configData.applicationData.units)) return false;
		if (this.configData.applicationData.units.length === 0) return false;
		return true;
	}

	getUnits(type = null) {
		if (!this.checkUnits()) return [];
		if (type !== null && ['weight', 'volume'].includes(type) === false) return [];

		if (!type) {
			return this.configData.applicationData.units;
		}
		if (type) {
			return this.configData.applicationData.units.filter((item) => item.type === type);
		}
	}

	//Array of allowed units for form validation
	getUnitsArray() {
		if (!this.checkUnits()) return [];
		return this.configData.applicationData.units.map((item) => item.name);
	}

	getUnitType(unitName = null) {
		if (!this.checkUnits()) return null;
		if (typeof unitName !== 'string') return null;
		const result = this.configData.applicationData.units.find(
			(item) => item.name.toLowerCase() === unitName.toLowerCase()
		);
		return result ? result.type : null;
	}
}
//==========================================//

//Helper to get deep nested property
function getDeepValue(o, s) {
	s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	s = s.replace(/^\./, ''); // strip a leading dot
	var a = s.split('.');
	for (var i = 0, n = a.length; i < n; ++i) {
		var k = a[i];
		if (k in o) {
			o = o[k];
		} else {
			return;
		}
	}
	return o;
}
