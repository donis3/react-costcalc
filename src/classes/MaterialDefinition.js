export default class MaterialDefinition {
	//Material definitions
	static fields = ['materialId', 'name', 'price', 'tax', 'currency', 'unit', 'density'];
	static numericFields = ['materialId', 'price', 'tax', 'density'];
	static textFields = ['name', 'currency', 'unit'];
	static sortDefault = 'materialId';

	static hasField(fieldname = null) {
		if (!fieldname) return false;
		return MaterialDefinition.fields.includes(fieldname);
	}
	static isFieldNumeric(fieldname) {
		if (!fieldname || typeof fieldname !== 'string') return false;
		return MaterialDefinition.numericFields.includes(fieldname);
	}
	static isFieldString(fieldname) {
		if (!fieldname || typeof fieldname !== 'string') return false;
		return MaterialDefinition.textFields.includes(fieldname);
	}

	static validateData(materialData = null, materialId = null) {
		if (!materialData || typeof materialData !== 'object' || Object.keys(materialData).length === 0) {
			return null;
		}
		//IF a material id is provided, add it to data
		if (materialId) {
			materialData.materialId = materialId;
		}

		const result = Object.keys(materialData).reduce((accumulator, current) => {
			if (MaterialDefinition.fields.includes(current)) {
				return { ...accumulator, [current]: materialData[current] };
			}
			return accumulator;
		}, {});

		if (Object.keys(result).length === MaterialDefinition.fields.length) {
			return result;
		}
		return null;
	}
}
