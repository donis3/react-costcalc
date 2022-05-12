import Material from "./Material";
import ArrayFunctions from "../lib/ArrayFunctions";

export default class Materials {
	//State and setter
	materials = [];
	setMaterials = () => {};

	//Constructor
	constructor(materials, setMaterials) {
		if (Array.isArray(materials)) {
			this.materials = materials;
		}
		if (typeof setMaterials === 'function') {
			this.setMaterials = setMaterials;
		}
	}


	add(newMaterialData) {
		//Calculate next id
		const nextMaterialId = ArrayFunctions.getMaxProperty(this.materials, 'materialId', false) + 1;

		//Validate new material data
		newMaterialData = Material.validateData(newMaterialData, nextMaterialId);
		if (!newMaterialData) return null;

		//Remove old material with same id if exists
		const currentMaterialState = this.materials.filter((item) => item.materialId !== newMaterialData.materialId);

		this.setMaterials([...currentMaterialState, newMaterialData]);

		return newMaterialData;
	}

	update(newMaterialData) {
		//Validate new material data
		newMaterialData = Material.validateData(newMaterialData);
		if (!newMaterialData) return null;

		//Validate material exists
		const result = this.findById(newMaterialData.materialId);
		if (!result) return null;

		//Remove old material with same id if exists
		const currentMaterialState = this.materials.filter((item) => item.materialId !== newMaterialData.materialId);

		this.setMaterials([...currentMaterialState, newMaterialData]);

		return newMaterialData;
	}

	delete(materialId = null) {
		if (!materialId || isNaN(parseInt(materialId))) return null;
		const result = this.materials.find((item) => item.materialId === materialId);
		if (!result) return null;
		//Create new array without the deleted one
		const currentMaterialState = this.materials.filter((item) => item.materialId !== materialId);

		//Save state
		this.setMaterials(currentMaterialState);

		//Return deleted item
		return result;
	}

}
