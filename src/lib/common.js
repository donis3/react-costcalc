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
	if (Array.isArray(subject) === false) {
		if (propertyName in subject) {
			return subject[propertyName];
		} else {
			return 0;
		}
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
