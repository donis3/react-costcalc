import useStorageRepo from '../common/useStorageRepo';
import mockData from '../../data/defaultData.json';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import { useEffect, useReducer, useState } from 'react';
import materialsReducer from './materialsReducer';
import { useTranslation } from 'react-i18next';

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

/* ==================================== 	HOOK	 ====================================== */
//Load materials from local storage
export default function useMaterials({ sort = null, asc = true } = {}) {
	const [storedMaterials, setStoredMaterials] = useStorageRepo('application', 'materials', mockData.materials);
	const [materials, dispatch] = useReducer(materialsReducer, storedMaterials);
	const { t } = useTranslation('pages/materials');

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

		findById: function (materialId = null) {
			if (!materialId || isNaN(parseInt(materialId))) return null;
			const result = this.materials.find((item) => item.materialId === materialId);
			if (!result) return null;
			return result;
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
		getAll: function ({ field = null, asc = true } = {}) {
			if (this.fields.includes(field) === false) field = this.fields[0];
			if (typeof asc !== 'boolean') asc = true;

			if (this.numericFields.includes(field)) {
				return sortArrayNumeric(this.materials, field, asc);
			} else {
				return sortArrayAlphabetic(this.materials, field, asc);
			}
		},
	};

	//Hook Returns
	return { Materials, dispatch };
} //End of hook
/* ========================================================================================= */
