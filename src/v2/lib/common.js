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
export function getMaxInArray(subject, propertyName, getObject = false) {
	//If subject is not an array, return the property value of the subject
	if (Array.isArray(subject) === false) {
		if (propertyName in subject) {
			return subject[propertyName];
		} else {
			return 0;
		}
	}
	if (subject.length === 0) {
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

export function sortArrayNumeric(data = [], prop = null, isAsc = true) {
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

export function sortArrayAlphabetic(data = [], prop = null, isAsc = true) {
	if (Array.isArray(data) === false || data.length <= 0) return [];
	if (prop) {
		if (typeof data[0] !== 'object' || prop in data[0] === false) {
			//Invalid Data
			return data;
		} else {
			return data.sort((a, b) => {
				if (typeof a[prop] !== 'string' || typeof b[prop] !== 'string') {
					return 0;
				}
				//Return -1 or 1 depending on asc or desc
				return isAsc ? a[prop]?.localeCompare(b[prop]) : b[prop]?.localeCompare(a[prop]);
			});
		}
	} else {
		return data.sort((a, b) => {
			//Return -1 or 1 depending on asc or desc
			return isAsc ? a.localeCompare(b) : b.localeCompare(a);
		});
	}
}

export function sortArrayDate(data = [], prop = null, isAsc = true) {
	if (Array.isArray(data) === false || data.length <= 0) return [];

	//Non object date array
	if (!prop) {
		return data.sort((a, b) => {
			//Return -1 or 1 depending on asc or desc
			if (a instanceof Date && b instanceof Date) {
				return isAsc ? a.getTime() > b.getTime() : a.getTime() < b.getTime();
			} else {
				return isAsc ? a.localeCompare(b) : b.localeCompare(a);
			}
		});
	}

	//Sort array of objects
	if (typeof data[0] !== 'object' || prop in data[0] === false) {
		//Invalid Data
		return data;
	}

	return data.sort((a, b) => {
		//Return -1 or 1 depending on asc or desc
		if (a[prop] instanceof Date && b[prop] instanceof Date) {
			return isAsc ? a[prop].getTime() > b[prop].getTime() : a[prop].getTime() < b[prop].getTime();
		} else {
			return isAsc ? a[prop].localeCompare(b[prop]) : b[prop].localeCompare(a[prop]);
		}
	});
}

export function getStorageSize(key = null, unit = 'auto') {
	if (typeof unit === 'string') unit = unit.toLowerCase();
	//Get storage size in bytes
	let result = 0;
	if (!key) {
		result = new Blob(Object.values(localStorage)).size;
	} else {
		if (key in localStorage) {
			result = new Blob(Object.values(localStorage[key])).size;
		}
	}

	//Find the multiplier to get requested unit
	let divider = 1;
	//Auto unit assignment
	if (unit === 'auto') {
		if (result < 1024) {
			unit = 'byte';
		} else if (result > 1024 && result < 1024 * 1024) {
			unit = 'kb';
		} else if (result >= 1024 * 1024 && result < 1024 * 1024 * 1024) {
			unit = 'mb';
		} else {
			unit = 'gb';
		}
	}
	switch (unit) {
		case 'kb':
			divider = 1024;
			break;
		case 'mb':
			divider = 1024 * 1024;
			break;
		case 'gb':
			divider = 1024 * 1024 * 1024;
			break;
		default:
			divider = 1;
			break;
	}
	return { size: result / divider, unit };
}
