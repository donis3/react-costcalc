import { useState, useEffect } from 'react';

/* Configuration */
const defaultSize = { height: 768, width: 1024 };

const screenSizes = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
};

/* Detection Functions */

const detectWindowSize = () => {
	if (!window) return defaultSize;
	return {
		width: window.innerWidth,
		height: window.innerHeight,
	};
};

const detectScreenType = () => {
	const { width } = detectWindowSize();
	if (width <= screenSizes.sm) {
		return 'sm';
	} else if (width <= screenSizes.md) {
		return 'md';
	} else if (width <= screenSizes.lg) {
		return 'lg';
	} else if (width <= screenSizes.xl) {
		return 'xl';
	}
};

/* Export hook */
const useWindowType = () => {
	const [windowType, setWindowType] = useState('lg');

	//useEffect only runs on client side. Run window detection on client side
	useEffect(() => {
		//Verify window exists
		if (typeof window === undefined) return;

		//Define resize handler function
		function handleWindowResize() {
			const currentWindowType = detectScreenType();

			//Change state only if necessary
			if (currentWindowType !== windowType) {
				setWindowType(currentWindowType);
			}
		}

		//Add resize event listener
		window.addEventListener('resize', handleWindowResize);

		//Run once for initial value
		handleWindowResize();

		//remove event listener
		return () => window.removeEventListener('resize', handleWindowResize);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { windowType };
};

export default useWindowType;
