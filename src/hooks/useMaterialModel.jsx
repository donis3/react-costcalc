import { getMaxInArray, sortArrayNumeric, sortArrayAlphabetic } from '../lib/common';

export default function useMaterialModel(materials, setMaterials) {
	const getNextId = () => {
		if (Array.isArray(materials) === false || materials.length <= 0) {
			return 0;
		}
		return parseInt(getMaxInArray(materials, 'materialId', false)) + 1;
	};

	//Handles updates aswell
	const addMaterial = (newMaterialData) => {
		//Make sure we have material id
		if (
			'materialId' in newMaterialData === false ||
			newMaterialData.materialId === null ||
			newMaterialData.materialId === undefined
		) {
			newMaterialData.materialId = getNextId();
		}
		//Check if material already exists
		const existingMaterial = getMaterial(newMaterialData.materialId);

		if (existingMaterial) {
			//Check if update is needed
			if (JSON.stringify(existingMaterial) === JSON.stringify(newMaterialData)) {
				//Update unnecessary
				return null;
			}

			//This is an update operation
			setMaterials((currentData) => {
				return currentData.map((item) => {
					if (item.materialId !== newMaterialData.materialId) {
						return item; //return other items
					} else {
						return newMaterialData; //change selected item
					}
				});
			});
		} else {
			//this is an add operation, add it directly
			setMaterials((currentData) => {
				return [newMaterialData, ...currentData];
			});
		}
		//return updated obj
		return newMaterialData;
	};

	const getMaterials = ({ field = 'materialId', asc = true } = {}) => {
		const numericFields = ['materialId', 'tax', 'price', 'density'];

		if (numericFields.includes(field)) {
			return sortArrayNumeric(materials, field, asc);
		} else {
			return sortArrayAlphabetic(materials, field, asc);
		}
	};

	const getCount = () => materials.length;
	const getKeys = () => {
		if (getCount() === 0) {
			return [];
		} else {
			return Object.keys(materials[0]);
		}
	};

	//Get a material by id
	const getMaterial = (materialId = null) => {
		if (materialId === null) return null;
		//id must be integer to pass equality test
		materialId = parseInt(materialId);

		const result = materials.find((material) => material.materialId === materialId);

		return result ? result : null;
	};

	const deleteMaterial = (materialId = null) => {
		const requestedMaterial = getMaterial(materialId);
		if (!requestedMaterial) return null;

		//remove the one with given id
		setMaterials((currentMaterials) => {
			return currentMaterials.filter((item) => item.materialId !== requestedMaterial.materialId);
		});

		return requestedMaterial;
	};


	//Create a material object with methods
	const addMaterialFunctions = (material) => {
		material.getPrice = function() {
			return this.price + ' ' + this.currency;
		}

		return material;
	}

	const getMaterialById = (id) => {
		const m = getMaterial(id);
		return m ? addMaterialFunctions(m) : null;
	}

	return { addMaterial, getMaterials, getCount, getKeys, getNextId, getMaterial, deleteMaterial, getMaterialById };
}
