import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Loading from './components/layout/Loading';
import './fonts';
// eslint-disable-next-line no-unused-vars
import i18n from './lib/i18n'; //Import i18next initialization

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
