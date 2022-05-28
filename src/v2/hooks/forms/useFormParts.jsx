import  { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function useFormParts(...partNames) {
	const { t } = useTranslation('formparts');
	const partCount = partNames.length;
	const indexLimit = partCount - 1;
	const initialState = partNames.map((part, i) => {
		return {
			name: part,
			text: t(part),
			index: i,
			step: i + 1,
			isActive: i === 0 ? true : false,
			hasError: false,
			isFirst: i === 0 ? true : false,
			isLast: i === indexLimit ? true : false,
		};
	}, []);

	const [parts, setParts] = useState(initialState);

	const getPart = (search = null) => {
		if (search === null) return;
		if (typeof search === 'string' && isNaN(parseInt(search))) {
			//Search by part name
			return parts.find((part) => part.name === search);
		} else if (isNaN(parseInt(search)) === false) {
			const index = parseInt(search);
			if (parts[index]) return parts[index];
		}
		return;
	};

	const setActive = (search = null) => {
		//Verify part exists
		const part = getPart(search);
		if (!part) return;
		//Activate it and deactivate others
		setParts(
			parts.map((item) => {
				if (item.index === part.index) {
					return { ...part, isActive: true };
				} else {
					return { ...item, isActive: false };
				}
			})
		);
	};

	/**
	 * Set hasError=true for given part.
	 *
	 * @param {*} search partName or index
	 * @returns
	 */
	const setError = (search = null, value = true) => {
		//Verify part exists
		const part = getPart(search);
		if (!part) return;
		//console.log(`Will set part ${part.text} error: ${value}`);
		//Activate it and deactivate others
		setParts(
			parts.map((item) => {
				if (item.index === part.index) {
					return { ...part, hasError: value };
				} else {
					return item;
				}
			})
		);
	};

	const hasError = (search = null) => {
		//Verify part exists
		const part = getPart(search);
		return part ? part.hasError : false;
	};

	const isActive = (search = null) => {
		//Verify part exists
		const part = getPart(search);
		return part ? part.isActive : false;
	};

	// const nextPart = () => {
	// 	const { index, isLast } = getActive();
	// 	if (isLast === true) return;
	// 	setActive(index + 1);
	// };

	// const previousPart = () => {
	// 	const { index, isFirst } = getActive();
	// 	if (isFirst === true) return;
	// 	setActive(index - 1);
	// };

	const getActive = () => {
		const result = parts.find((item) => item.isActive === true);
		if (!result) {
			console.log(`Error: useFormParts has no active section.`);
			return {};
		}
		return result;
	};

	/**
	 * Go to next part if part has no errors
	 * if hasError provided, will mark current part with error flag
	 * @param {*} param0
	 */
	function goTo(target = null, hasError = false) {
		let targetIndex = null;
		//get current
		const { index, isLast, isFirst } = getActive();
		//Determine target
		if (target === 'next') {
			targetIndex = index + 1;
			if (isLast) return;
		} else if (target === 'previous') {
			targetIndex = index - 1;
			if (isFirst) return;
		} else {
			const targetPart = getPart(target);
			if (targetPart && targetIndex.index !== index) {
				targetIndex = targetPart.index;
			}
		}
		//Validate
		if (isNaN(targetIndex) || !parts[targetIndex]) return;

		if (!hasError) {
			setParts(
				parts.map((part) => {
					if (part.index === targetIndex) {
						return { ...part, isActive: true };
					} else if (part.index === index) {
						return { ...part, hasError: false, isActive: false };
					} else {
						return { ...part, isActive: false };
					}
				})
			);
		} else {
			//Part has errors. Dont change active but mark this one with error
			setParts(
				parts.map((part) => {
					if (part.index !== index) {
						return part;
					} else {
						return { ...part, hasError: true };
					}
				})
			);
		}
	}

	return {
		parts,
		getPart,
		setActive,
		setError,
		hasError,
		isActive,
		getActive,

		controls: {
			next: (hasError = false) => goTo('next', hasError),
			previous: (hasError = false) => goTo('previous', hasError),
			total: partCount,
			current: getActive() ? getActive().index + 1 : 1,
			first: () => setActive(0),
			setError,
		},
	};
}
