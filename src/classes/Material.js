export default class Material {
	//Material definitions
	static fields = ['materialId', 'name', 'price', 'tax', 'currency', 'unit', 'density'];
	static numericFields = ['materialId', 'price', 'tax', 'density'];
	static textFields = ['name', 'currency', 'unit'];

	static isFieldNumeric(fieldname) {
		if (!fieldname || typeof fieldname !== 'string') return false;
		return Material.numericFields.includes(fieldname);
	}
    static isFieldString(fieldname) {
		if (!fieldname || typeof fieldname !== 'string') return false;
		return Material.textFields.includes(fieldname);
	}
}
