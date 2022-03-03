import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Materials from './pages/materials/Materials';
import NotFound from './pages/NotFound';
import Products from './pages/products/Products';


export default function Router() {
	
	return (
		<Routes>
			{/* Business Routes */}
			<Route path='/materials' element={<Materials />} />
			<Route path='/products' element={<Products />} />

			{/* Homepage */}
			<Route path='/' element={<HomePage />} />
			{/* Catch All Route */}
			<Route path='/*' element={<NotFound />} />
		</Routes>
	);
}
