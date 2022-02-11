import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import i18n from './lib/i18n';

ReactDOM.render(
	<Suspense fallback='loading...'>
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	</Suspense>,
	document.getElementById('root')
);
