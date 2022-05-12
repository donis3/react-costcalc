import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/common/NotFound';
import Home from './pages/Home';

export default function Router() {
	return (
		<Routes>

			{/* Homepage */}
			<Route path='/' element={<Home />} />
			{/* Catch All Route */}
			<Route path='/*' element={<NotFound />} />
		</Routes>
	);
}
