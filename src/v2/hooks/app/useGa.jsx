import { useEffect, useState } from 'react';
import config from '../../config/config.json';
import { useLocation } from 'react-router-dom';
import GA4React from 'ga-4-react';

//TODO: Add Consent

export default function useGa() {
	const measurementId = config?.analytics?.measurementId || null;
	const { pathname } = useLocation();

	//Current module path without item ID's
	const [currentModule, setCurrentModule] = useState('/');
	//Save current analytics object in state
	const [ga, setGa] = useState(null);

	/**
	 * Initialize Google Analytics and set ga state value to ga wrapper obj
	 * @returns
	 */
	const initializeGa = async () => {
		if (!measurementId) return;
		const ga4react = new GA4React(measurementId);
		try {
			const ga4 = await ga4react.initialize();
			setGa(ga4);
		} catch (e) {
			if (config?.debug?.analytics) {
				console.log('GA4 Err:', e.message);
			}
		}
	};

	/**
	 * When location changes, detect current module name for analytics
	 */
	useEffect(() => {
		const paths = pathname.split('/').filter((x) => x?.length > 0);
		let path = '/';
		if (paths.length > 0) {
			path = '/' + paths[0];
		}
		if (path !== currentModule) {
			setCurrentModule(path);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	/**
	 * Triggers when page changes & ga changes
	 * If ga obj is not ready initialize it then send pageview
	 */
	useEffect(() => {
		if (!ga) return initializeGa();
		if (config?.debug?.analytics) {
			console.log(`Sending analytics data: pageview('${currentModule}')`);
		}
		ga.pageview(currentModule);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ga, currentModule]);

	return { currentModule };
}
