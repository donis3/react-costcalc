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

	getBaseUnit(unitName = null) {
		if (this.getUnitType(unitName) === 'volume') {
			return 'L';
		} else {
			return 'kg';
		}
	}

	getUnit(unitName = null) {
		if (!this.checkUnits()) return null;
		if (typeof unitName !== 'string') return null;
		return this.configData.applicationData.units.find((item) => item.name.toLowerCase() === unitName.toLowerCase());
	}

	isLiquid(unitName = null) {
		if (this.getUnitType(unitName) === 'volume') {
			return true;
		} else {
			return false;
		}
	}

	//Get unique key for this state
	getUniqueKey(identifier = null) {
		if (!identifier) return null;
		//Clean the identifier
		identifier = identifier.replace(/\s/g, '_');
		identifier = identifier.replace(/\W/g, '');
		//check again
		if (identifier.length === 0) return null;
		return `${this.configData.app.localStorageKey}.${identifier}`;
	}

	/**
	 * Get a storage key for given identifier
	 * @param {string} identifier
	 * @returns {string} storage key
	 */
	getStorageKey(identifier = null) {
		if (typeof identifier !== 'string') throw new Error('An identifier is required');
		identifier = identifier.replace(/\s/g, '_');
		identifier = identifier.replace(/\W/g, '');
		if (!identifier || identifier.length < 1) throw new Error('An identifier is required');
		return `${this.configData.app.localStorageKey}.${identifier}`;
	}
	/**
	 * Get Array of module names
	 * @returns {Array} [...moduleNames]
	 */
	getModuleNames() {
		return Object.keys(this.configData.modules);
	}

	getModule(name = null) {
		if (name in this.configData.modules) {
			return this.configData.modules[name];
		} else {
			throw new Error('Invalid module name provided: ' + name);
		}
	}
} //End of class
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
