import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';

export default function useGa() {
	ReactGA.initialize('G-12WJMQK73C', { testMode: true });
	const { pathname } = useLocation();
	const paths = pathname.split('/').filter((x) => x?.length > 0);
	let path = '/';
	if (paths.length > 0) {
		path = '/' + paths[0];
	}

	useEffect(() => {
		ReactGA.send({ hitType: 'pageview', page: path });
	});

	return {};
}
