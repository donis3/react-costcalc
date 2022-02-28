import Material from '../classes/Material';
import ArrayFunctions from '../lib/ArrayFunctions';

export default class MaterialController extends ArrayFunctions {
	/**
	 * Pass the react state of materials
	 * @param {*} materials
	 * @param {*} setMaterials
	 */
	constructor(materials = [], setMaterials = null) {
		super();
		if (!materials || Array.isArray(materials) === false) {
			this.materials = [];
		} else {
			this.materials = materials;
		}
		if (typeof setMaterials === 'function') {
			this.setMaterials = setMaterials;
		} else {
			this.setMaterials = (data) => (this.materials = data);
		}
	}
	get total() {
		return this.materials.length ?? 0;
	}

	getOne(materialId = null) {
		if (materialId === null || typeof materialId !== 'number' || materialId < 0 || !this.materials) {
			return null;
		}
		const result = this.materials.find((item) => item.materialId === materialId);
		if (result) {
			return result;
		}
		return null;
	}

	getAll({ field = 'materialId', asc = true } = {}) {
		//Validate
		if (!Material.fields.includes(field)) field = 'materialId';
		if (this.total === 0) return [];

		//Determine sorting method
		const sortingMethod = Material.isFieldNumeric(field)
			? this.constructor.sortPropertyNumeric
			: this.constructor.sortPropertyAlphabetic;

		return sortingMethod(this.materials, field, asc);
	}
}
