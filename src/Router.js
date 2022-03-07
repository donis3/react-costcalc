import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Currency from './pages/currencies/Currency';
import CurrencySelectOne from './pages/currencies/CurrencySelectOne';
import HomePage from './pages/HomePage';
import Materials from './pages/materials/Materials';
import NotFound from './pages/NotFound';
import Products from './pages/products/Products';
import Recipe from './pages/recipes/Recipe';
import Recipes from './pages/recipes/Recipes';

export default function Router() {
	return (
		<Routes>
			{/* Business Routes */}
			<Route path='/materials' element={<Materials />} />
			<Route path='/products' element={<Products />} />
			<Route path='/currency' element={<CurrencySelectOne />} />
			<Route path='/currency/:currency' element={<Currency />} />
			<Route path='/recipes' element={<Recipes />} />
			<Route path='/recipes/:recipeId' element={<Recipe />} />

			{/* Homepage */}
			<Route path='/' element={<HomePage />} />
			{/* Catch All Route */}
			<Route path='/*' element={<NotFound />} />
		</Routes>
	);
}
