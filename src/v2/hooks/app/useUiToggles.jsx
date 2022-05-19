import useStorageState from '../common/useStorageState';

const defaultOptions = {
	localPrice: true,
	baseUnit: false,
	showTax: false,
	showPeriod: 'y', //For expenses
	showCategory: [], //For expenses
};

/**
 *	Global ui toggles for app
 * @returns [getOption, setOption, displayState]
 */
export default function useUiToggles() {
	const [displayState, setDisplayState] = useStorageState('displaySettings', defaultOptions);

	const getOption = (option = null) => {
		if (!option) return null;
		if (option in displayState === false) return null;
		return displayState[option];
	};

	const setOption = (option = null, value = null) => {
		if (!option || option in defaultOptions === false) return;

		//Check if option is bool and try to toggle if value is null
		if (typeof defaultOptions[option] === 'boolean') {
			if (typeof value !== 'boolean') value = null;
			if (value === null) value = !displayState[option]; //if no value is provided, toggle the value
		}

		setDisplayState({ ...displayState, [option]: value });
	};

	return [getOption, setOption, displayState];
}
