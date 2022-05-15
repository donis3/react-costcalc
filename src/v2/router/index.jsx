import React from 'react';
import { Route, Routes } from 'react-router-dom';
import useSettings from '../context/settings/useSettings';

//Currency
import Currencies from '../pages/currencies/Currencies';
import Currency from '../pages/currencies/Currency';

//Other
import Home from '../pages/Home';
import About from '../pages/other/About';
import Contact from '../pages/other/Contact';
import Demo from '../pages/other/Demo';
import Help from '../pages/other/Help';
import NotFound from '../pages/other/NotFound';
import Welcome from '../pages/other/Welcome';

//Settings
import Settings from '../pages/settings/Settings';

export default function Router() {
	//Detect first time setup
	const { setupComplete } = useSettings();

	if (!setupComplete) return <WelcomeRouter />;
	return (
		<Routes>
			{/* ===================== Currencies  ===================== */}
			<Route path='/currency' element={<Currencies />} />
			<Route path='/currency/:currency' element={<Currency />} />

			{/* ===================== Settings  ===================== */}
			<Route path='/settings' element={<Settings />} />

			{/* ===================== Other Routes  ===================== */}
			<Route path='/demo' element={<Demo />} />
			<Route path='/contact' element={<Contact />} />
			<Route path='/about' element={<About />} />
			<Route path='/help' element={<Help />} />
			<Route path='/' element={<Home />} />
			<Route path='/*' element={<NotFound />} />
		</Routes>
	);
}

/**
 * If first time setup is not yet complete
 * only allow welcome page, demo, static pages and setup page
 */
function WelcomeRouter() {
	return (
		<Routes>
			{/* ===================== Settings  ===================== */}
			<Route path='/settings' element={<Settings />} />

			{/* ===================== Other Routes  ===================== */}
			<Route path='/demo' element={<Demo />} />
			<Route path='/contact' element={<Contact />} />
			<Route path='/about' element={<About />} />
			<Route path='/help' element={<Help />} />
			<Route path='/*' element={<Welcome />} />
		</Routes>
	);
}
