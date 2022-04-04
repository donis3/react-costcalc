import useStorageRepo from '../common/useStorageRepo';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import { useEffect, useReducer } from 'react';
import materialsReducer from './materialsReducer';
import { useTranslation } from 'react-i18next';
import useConfig from '../app/useConfig';
import useIntl from '../common/useIntl';
import useCurrencyConversion from '../app/useCurrencyConversion';
import Material from './Material';

/**
 * Define fields and defaults for a material
 */
export const fields = {
	materialId: { type: 'numeric', default: 0 },
	tax: { type: 'numeric', default: 0 },
	price: { type: 'numeric', default: 0 },
	density: { type: 'numeric', default: 1 },
	name: { type: 'string', default: '' },
	provider: { type: 'string', default: '' },
	currency: { type: 'string', default: 'TRY' },
	unit: { type: 'string', default: 'kg' },
	priceHistory: { type: 'array', default: [] },
	localPriceHistory: { type: 'array', default: [] },
	createdAt: { type: 'numeric', default: Date.now() },
	updatedAt: { type: 'numeric', default: Date.now() },
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
			if (isNaN(parseInt(materialId))) return null;
			materialId = parseInt(materialId);
			const result = this.materials.find((item) => item.materialId === materialId);
			if (!result) return null;
			//Deep copy
			const materialData = JSON.parse(JSON.stringify(result));

			const material = classObject
				? new Material(materialData, t, config, displayConvertedMoney, displayNumber, convert)
				: materialData;

			return material;
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

		//Update price history for a material if required
		recordPriceForMaterial: function (material) {
			if (!material) return;
			const currentLocalPrice = {
				date: Date.now(),
				amount: material.localPrice,
			};
			const currentPrice = {
				date: Date.now(),
				amount: material.price,
			};
			dispatch({
				type: 'addPriceHistory',
				payload: {
					materialId: material.materialId,
					priceItem: currentPrice,
				},
			});

			dispatch({
				type: 'addLocalPriceHistory',
				payload: {
					materialId: material.materialId,
					priceItem: currentLocalPrice,
				},
			});
		},
	};

	//Hook Returns
	return { Materials, dispatchMaterials: dispatch };
} //End of hook
