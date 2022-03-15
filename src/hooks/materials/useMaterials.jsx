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
	const { displayNumber } = useIntl();
	const { displayMoney: displayConvertedMoney, convert } = useCurrencyConversion();

	//Write to repo when materials change
	useEffect(() => {
		setStoredMaterials(materials);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [materials]);

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

		/**
		 * Create array that is suitable for FormInput.Select
		 * This will be used for generating a select item with all materials
		 */
		getSelectOptions: function () {
			const data = this.getAll({ field: 'name', asc: true });
			return data.map((item) => ({ name: item.name, value: item.materialId }));
		},

		getDefaultSelectId: function () {
			const data = this.getAll({ field: 'name', asc: true });
			if (data && Array.isArray(data) && data.length > 0) return data[0].materialId;
			return null;
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
	isBaseUnit = false;
	baseUnitPrice = 0; //Converted price from other units to L or KG
	baseUnitPriceWithTax = 0; //Converted price from other units to L or KG

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
		this.calculateBaseUnitPrice();

		//Determine if this materials unit is already a base unit
		if (config.getBaseUnit(data.unit) === data.unit) this.isBaseUnit = true;
	}

	calculatePriceWithTax() {
		let p = parseFloat(this.price);
		let t = parseFloat(this.tax);
		if (isNaN(p) || isNaN(t)) return (this.taxedPrice = p);
		if (t === 0) return (this.taxedPrice = p);
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

	get baseUnit() {
		return this.config.getBaseUnit(this.unit);
	}

	get isLiquid() {
		return this.config.isLiquid(this.unit);
	}

	get localBaseUnitPrice() {
		if (!this.isForeignCurrency) return this.baseUnitPrice;
		const result = this.convert(this.baseUnitPrice, this.currency);
		return result ? result.amount : null;
	}
	get localBaseUnitPriceWithTax() {
		if (!this.isForeignCurrency) return this.baseUnitPriceWithTax;
		const result = this.convert(this.baseUnitPriceWithTax, this.currency);
		return result ? result.amount : null;
	}

	/**
	 * Should run at constructor
	 * Convert price to per base unit
	 * For example if the price is per tonne convert it to per kg
	 */
	calculateBaseUnitPrice() {
		//get unit conversion
		const unit = this.config.getUnit(this.unit);
		if (!unit || 'value' in unit === false || isNaN(parseFloat(unit.value))) return;
		//This is the ratio between unit/base unit.
		//to get the base price, we must divide normal price to this ratio
		const unitToBaseUnitRatio = parseFloat(unit.value);
		if (unitToBaseUnitRatio <= 0) return;
		//Calculate prices
		this.baseUnitPrice = this.price / unitToBaseUnitRatio;
		this.baseUnitPriceWithTax = this.taxedPrice / unitToBaseUnitRatio;
	}
}
