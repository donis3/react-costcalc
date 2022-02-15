import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Loading from './components/layout/Loading';

import './lib/i18n';//Import i18next initialization

ReactDOM.render(
	<Suspense fallback={<Loading />}>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Suspense>,
	document.getElementById('root')
);