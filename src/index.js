import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loading from './v2/components/layout/Loading';
import './v2/fonts';
import './v2/index.css';
import App from './v2/App';
// eslint-disable-next-line no-unused-vars
import './v2/lib/i18n'; //Import i18next initialization
import { loadThemeFromStorage } from './v2/helpers/themeHelper';
import GA4React from 'ga-4-react';
const ga4react = new GA4React('G-12WJMQK73C', { cookieFlags: 'max-age=7200;secure;samesite=none' });

//Get theme value from storage and set document data-theme attribute in index.html
loadThemeFromStorage();

// ReactDOM.render(
// 	<Suspense fallback={<Loading />}>
// 		<React.StrictMode>
// 			<BrowserRouter basename={process.env.PUBLIC_URL}>
// 				<App />
// 			</BrowserRouter>
// 		</React.StrictMode>
// 	</Suspense>,
// 	document.getElementById('root')
// );

//Initialize google analytics
(async () => {
	await ga4react.initialize();

	ReactDOM.render(
		<Suspense fallback={<Loading />}>
			<React.StrictMode>
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<App />
				</BrowserRouter>
			</React.StrictMode>
		</Suspense>,
		document.getElementById('root')
	);
})();
