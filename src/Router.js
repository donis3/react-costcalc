import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import Materials from './components/pages/materials/Materials';
import NotFound from './components/pages/NotFound';


export default function Router() {
	return (
		<Routes>
			{/* Business Routes */}
			<Route path='/materials' element={<Materials />} />

			{/* Homepage */}
			<Route path='/' element={<HomePage />} />
			{/* Catch All Route */}
			<Route path='/*' element={<NotFound />} />
		</Routes>
	);
}
