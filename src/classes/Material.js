import MaterialDefinition from './MaterialDefinition';

export default class Material extends MaterialDefinition {
	original = null; //Data that is originally loaded

	//Copy given properties to this instance
	constructor(materialData) {
		super(materialData); //Mandatory
		const filteredData = Material.validateData(materialData);
		if (filteredData) {
			Object.keys(filteredData).forEach((key) => (this[key] = filteredData[key]));
			this.original = { ...filteredData }; //Backup original data
		}
	}

	//If any values are changed, return new object or null
	isModified() {
		//Map new data
		const newData = Material.fields.reduce((accumulator, currentField) => {
			return { ...accumulator, [currentField]: this[currentField] };
		}, {});
		//Compare to original
		const changedValues = Material.fields.reduce((total, current) => {
			if (newData[current] === this.original[current]) {
				//Both data are the same
				return total;
			}
			return total + 1;
		}, 0);
		//Nothing to save
		if( changedValues === 0) return null;

		return newData;
	}
}
