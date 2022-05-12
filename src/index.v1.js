import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loading from './v1/components/layout/Loading';
import './v1/fonts';
import './v1/index.css';
import App from './v1/App';
// eslint-disable-next-line no-unused-vars
import i18n from './v1/lib/i18n'; //Import i18next initialization

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
