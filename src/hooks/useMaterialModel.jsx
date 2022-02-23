import { getMaxInArray, sortArrayNumeric, sortArrayAlphabetic } from '../lib/common';

export default function useMaterialModel(materials, setMaterials) {
	const getNextId = () => {
		if (Array.isArray(materials) === false || materials.length <= 0) {
			return 0;
		}
		return parseInt(getMaxInArray(materials, 'materialId', false)) + 1;
	};

	const addMaterial = (newMaterialData) => {
		newMaterialData.materialId = getNextId();
		setMaterials((currentData) => {
			return [newMaterialData, ...currentData];
		});
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
        
        if( getCount() === 0) {
            return [];
        } else {
            return Object.keys(materials[0]);
        }
    }

	return { addMaterial, getMaterials, getCount, getKeys, getNextId};
}
