import useStorageRepo from '../common/useStorageRepo';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import { useEffect, useReducer } from 'react';
import materialsReducer from './materialsReducer';
import { useTranslation } from 'react-i18next';
import useConfig from '../app/useConfig';

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

			return classObject ? new Material(result, t, config) : result;
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

	constructor(data = null, translate = null, config = null) {
		if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return null;
		if (translate && typeof translate === 'function') this.t = translate;
		if (config && typeof config === 'object') this.config = config;

		//Get all data
		Object.keys(data).forEach((key) => {
			if (!this.fields.includes(key)) return;
			this[key] = data[key];
		});

		this.calculatePriceWithTax();
	}

	calculatePriceWithTax () {
		let p = parseFloat(this.price);
		let t = parseFloat(this.tax);
		if( !p || !t) return;
		if(!t) return this.taxedPrice = p;
		this.taxedPrice = p + ( (p/100) * t );
	}

	get fullPrice() {
		return `${parseFloat(this.price).toFixed(2)} ${this.config.getCurrencySymbol(this.currency)}`;
	}

	get fullUnit() {
		return ` ${this.t(`units.${this.unit}`, { ns: 'translation' })}  (${this.unit})`;
	}

	get fullDensity() {
		return `${this.t('details.densityText', { value: parseFloat(this.density).toFixed(2) })}`;
	}
	get fullTax() {
		return `%${parseFloat(this.tax).toFixed(2) }`;
	}

	get priceWithTax() {
		
		
		return `${parseFloat(this.taxedPrice).toFixed(2)} ${this.config.getCurrencySymbol(this.currency)} / ${this.unit}`;
	}
}
