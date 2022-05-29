import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGA4React } from 'ga-4-react';

export default function useGa() {
	const ga = useGA4React();
	const { pathname } = useLocation();
	const [currentModule, setCurrentModule] = useState('/');

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

	useEffect(() => {
		if (ga && currentModule) ga.pageview(currentModule);
	}, [currentModule, ga]);

	return { currentModule };
}
