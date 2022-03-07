import useStorageRepo from '../common/useStorageRepo';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import { useEffect, useReducer } from 'react';
import materialsReducer from './materialsReducer';
import { useTranslation } from 'react-i18next';
import useConfig from '../app/useConfig';
import useIntl from '../common/useIntl';
import useCurrencyConversion from '../app/useCurrencyConversion';

/**
 * Define fields and defaults for a material
 */
export const fields = {
	materialId: { type: 'numeric', default: 1 },
	tax: { type: 'numeric', default: 0 },
	price: { type: 'numeric', default: 0 },
	density: { type: 'numeric', default: 1 },
	name: { type: 'string', default: '' },
	currency: { type: 'string', default: 'TRY' },
	unit: { type: 'string', default: 'kg' },
};

/* ==================================== Note: Import Through Context	 ====================================== */
//Load materials from local storage
export default function useMaterials() {
	const [storedMaterials, setStoredMaterials] = useStorageRepo('application', 'materials', []);
	const [materials, dispatch] = useReducer(materialsReducer, storedMaterials);
	const { t } = useTranslation('pages/materials');
	const config = useConfig();
	const { displayMoney, displayNumber } = useIntl();
	const { displayMoney: displayConvertedMoney, convert } = useCurrencyConversion();

	//Write to repo when materials change
	useEffect(() => {
		setStoredMaterials(materials);
	}, [materials, setStoredMaterials]);

	//Materials Presentation Object. Will not manipulate original material state. Safe to pass to UI
	const Materials = {
		materials: Array.isArray(materials) ? [...materials] : [], //Copy current materials to avoid mutating state,

		fields: Object.keys(fields),

		numericFields: Object.keys(fields).filter((key) => fields[key].type === 'numeric'),

		defaultObject: function () {
			const result = {};
			this.fields.forEach((key) => {
				result[key] = fields[key].default;
			});
			result.name = t('form.defaultName');
			return result;
		},

		findById: function (materialId = null, classObject = false) {
			if (!materialId || isNaN(parseInt(materialId))) return null;
			const result = this.materials.find((item) => item.materialId === materialId);
			if (!result) return null;

			return classObject ? new Material(result, t, config, displayConvertedMoney, displayNumber, convert) : result;
		},

		search: function (query = null) {
			if (!this.materials || this.materials.length === 0) return [];
			if (typeof query !== 'string' || query.length < 3) return [];
			return this.materials.filter((item) => {
				const s = new RegExp(query, 'i');
				return item.name.search(s) >= 0 ? true : false;
			});
		},

		//Get all materials after sorting
		getAll: function (sortingState = null) {
			//If sorting state is not an object
			if (!sortingState || typeof sortingState !== 'object' || Object.keys(sortingState).length < 1) {
				return this.materials;
			}
			//Get field and asc from any object
			let [field, asc] = Object.values(sortingState);

			if (this.fields.includes(field) === false) field = this.fields[0];
			if (typeof asc !== 'boolean') asc = true;

			if (this.numericFields.includes(field)) {
				return sortArrayNumeric(this.materials, field, asc);
			} else {
				return sortArrayAlphabetic(this.materials, field, asc);
			}
		},

		count: function () {
			return this.materials.length;
		},
	};

	//Hook Returns
	return { Materials, dispatchMaterials: dispatch };
} //End of hook
/* ========================================================================================= */

/**
 * Single Material constructor
 */
class Material {
	t = (text) => text; //Default translate function
	fields = Object.keys(fields);
	config = {};
	taxedPrice = 0;
	displayMoney = (amount, currency) => currency + ' ' + amount;
	displayNumber = (n) => n;
	convert = (amount, currency, target) => null;
	defaultCurrency = null;

	constructor(data = null, translate = null, config = null, displayMoney = null, displayNumber = null, convert = null) {
		if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return null;
		if (translate && typeof translate === 'function') this.t = translate;
		if (config && typeof config === 'object') this.config = config;

		if (typeof displayMoney === 'function') this.displayMoney = displayMoney;
		if (typeof displayNumber === 'function') this.displayNumber = displayNumber;
		if (typeof convert === 'function') this.convert = convert;

		//Get all data
		Object.keys(data).forEach((key) => {
			if (!this.fields.includes(key)) return;
			this[key] = data[key];
		});

		//Get default currency for conversions
		this.defaultCurrency = this.config.getDefaultCurrency(true);

		this.calculatePriceWithTax();
	}

	calculatePriceWithTax() {
		let p = parseFloat(this.price);
		let t = parseFloat(this.tax);
		if (!p || !t) return;
		if (!t) return (this.taxedPrice = p);
		this.taxedPrice = p + (p / 100) * t;
	}

	get fullPrice() {
		return this.displayMoney(this.price, this.currency);
	}

	get fullUnit() {
		return ` ${this.t(`units.${this.unit}`, { ns: 'translation' })}  (${this.unit})`;
	}

	get fullDensity() {
		return `${this.t('details.densityText', { value: this.displayNumber(this.density, 2) })}`;
	}
	get fullTax() {
		return `% ${this.displayNumber(this.tax, 2)}`;
	}

	get priceWithTax() {
		return this.displayMoney(this.taxedPrice, this.currency);
	}

	get localPriceWithTax() {
		const localPriceObj = this.convert(this.taxedPrice, this.currency, this.defaultCurrency);
		return localPriceObj ? localPriceObj.amount : null;
	}

	get localPrice() {
		const localPriceObj = this.convert(this.price, this.currency, this.defaultCurrency);
		return localPriceObj ? localPriceObj.amount : null;
	}

	get localPriceString() {
		return this.displayMoney(this.localPrice, this.defaultCurrency);
	}
	get localPriceWithTaxString() {
		return this.displayMoney(this.localPriceWithTax, this.defaultCurrency);
	}

	get isForeignCurrency() {
		return this.defaultCurrency !== this.currency;
	}
}
