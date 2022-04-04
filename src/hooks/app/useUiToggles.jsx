import React from 'react';
import useStorageState from '../common/useStorageState';

const defaultOptions = {
	localPrice: true,
	baseUnit: false,
	showTax: false,
};

export default function useUiToggles() {
	const [displayState, setDisplayState] = useStorageState('displaySettings', defaultOptions);

	const getOption = (option = null) => {
		if (!option) return null;
		if (option in displayState === false) return null;
		return displayState[option];
	};

	const setOption = (option = null, value = null) => {
		if (!option || option in displayState === false) return;
		if (typeof value !== 'boolean') value = null;
		if (value === null) value = !displayState[option]; //if no value is provided, toggle the value
		setDisplayState({ ...displayState, [option]: value });
	};

	return [getOption, setOption, displayState];
}
