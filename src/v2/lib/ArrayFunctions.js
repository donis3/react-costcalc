export default class ArrayFunctions {
	/**
	 * Go through an array of objects that has a property like Id (numeric)
	 * and find the max value of that property
	 *
	 * @param {Array} array Array that contains objects with a numeric property to search
	 * @param {string} propertyName Property in the objects
	 * @param {boolean} getObject Will return the found object itself if set to true. Otherwise will return max val
	 * @returns {number} Max value of the property in the array
	 *
	 */
	static getMaxProperty(subject, propertyName, getObject = false) {
		if (Array.isArray(subject) === false) {
			if (propertyName in subject) {
				return subject[propertyName];
			} else {
				return 0;
			}
		}
		if( subject.length === 0) {
			return 0;
		}

		const objectWithMaxValue = subject.reduce((previous, current) => {
			if (current[propertyName] > previous[propertyName]) {
				return current;
			} else {
				return previous;
			}
		});

		if (getObject === true) {
			return objectWithMaxValue;
		} else {
			return objectWithMaxValue[propertyName];
		}
	}

	static sortPropertyNumeric(data = [], prop = null, isAsc = true) {
		if (Array.isArray(data) === false || data.length <= 0) return [];
		if (prop) {
			if (typeof data[0] !== 'object' || prop in data[0] === false) {
				//Invalid Data
				return data;
			} else {
				return data.sort((a, b) => {
					//Return -1 or 1 depending on asc or desc
					return (parseFloat(a[prop]) < parseFloat(b[prop]) ? -1 : 1) * (isAsc ? 1 : -1);
				});
			}
		} else {
			return data.sort((a, b) => {
				//Return -1 or 1 depending on asc or desc
				return (parseFloat(a) < parseFloat(b) ? -1 : 1) * (isAsc ? 1 : -1);
			});
		}
	}

	static sortPropertyAlphabetic(data = [], prop = null, isAsc = true) {
		if (Array.isArray(data) === false || data.length <= 0) return [];
		if (prop) {
			if (typeof data[0] !== 'object' || prop in data[0] === false) {
				//Invalid Data
				return data;
			} else {
				return data.sort((a, b) => {
					//Return -1 or 1 depending on asc or desc
					return isAsc ? a[prop].localeCompare(b[prop]) : b[prop].localeCompare(a[prop]);
				});
			}
		} else {
			return data.sort((a, b) => {
				//Return -1 or 1 depending on asc or desc
				return isAsc ? a.localeCompare(b) : b.localeCompare(a);
			});
		}
	}
}
