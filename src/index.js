import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loading from './v2/components/layout/Loading';
import './v2/fonts';
import './v2/index.css';
import App from './v2/App';
import i18n from './v2/lib/i18n';
import { loadThemeFromStorage } from './v2/helpers/themeHelper';

console.log(`Loaded ${i18n.language} language`);

//Get theme value from storage and set document data-theme attribute in index.html
loadThemeFromStorage();

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
