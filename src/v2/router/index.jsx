import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/other/About';
import Contact from '../pages/other/Contact';
import Demo from '../pages/other/Demo';
import Help from '../pages/other/Help';
import NotFound from '../pages/other/NotFound';
import Settings from '../pages/settings/Settings';

export default function Router() {
	return (
		<Routes>
			{/* ===================== Settings  ===================== */}
			<Route path='/' element={<Settings />} />

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
