import { useState, useEffect } from 'react';
import config from '../../config/config.json';

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
	if (width < screenSizes.md) {
		return 'sm';
	} else if (width < screenSizes.lg) {
		return 'md';
	} else if (width < screenSizes.xl) {
		return 'lg';
	} else if (width >= screenSizes.xl) {
		return 'xl';
	}
};

/* Export hook */
const useWindowType = () => {
	const [windowType, setWindowType] = useState(detectScreenType());

	//useEffect only runs on client side. Run window detection on client side
	useEffect(() => {
		//Verify window exists
		if (typeof window === undefined) return;

		const changeWindowType = () => {
			const currentWindowType = detectScreenType();
			if (currentWindowType !== windowType) {
				setWindowType(currentWindowType);
			}
		};

		//Add resize event listener
		window.addEventListener('resize', changeWindowType);

		//remove event listener
		return () => window.removeEventListener('resize', changeWindowType);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	config.debug.windowType && console.log(`[WindowSize] ${windowType} `);
	return { windowType };
};

export default useWindowType;
