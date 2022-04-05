import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Company from './pages/company/Company';
import Employees from './pages/company/Employees';
import Expenses from './pages/company/Expenses';

import Currency from './pages/currencies/Currency';
import CurrencySelectOne from './pages/currencies/CurrencySelectOne';
import EndProduct from './pages/endproducts/EndProduct';
import EndProductForm from './pages/endproducts/EndProductForm';
import EndProducts from './pages/endproducts/EndProducts';
import HomePage from './pages/HomePage';
import MaterialForm from './pages/materials/form/MaterialForm';
import Material from './pages/materials/Material';
import Materials from './pages/materials/Materials';
import NotFound from './pages/NotFound';
import Package from './pages/packages/Package';
import PackageForm from './pages/packages/PackageForm';
import Packages from './pages/packages/Packages';
import Products from './pages/products/Products';
import Recipe from './pages/recipes/Recipe';
import RecipeForm from './pages/recipes/RecipeForm';
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
			<Route path='/recipes/add' element={<RecipeForm />} />
			<Route path='/recipes/edit/:recipeId' element={<RecipeForm />} />

			{/* Experimental */}
			<Route path='/materials/:materialId' element={<Material />} />
			<Route path='/materials/add' element={<MaterialForm />} />
			<Route path='/materials/edit' element={<Materials />} />
			<Route path='/materials/edit/:materialId' element={<MaterialForm isEdit={true} />} />

			{/* Company */}
			<Route path='/company' element={<Company />}  />
			<Route path='/company/employees' element={<Employees />} />
			<Route path='/company/expenses' element={<Expenses />} />

			{/* Packages */}
			<Route path='/packages' element={<Packages />} />
			<Route path='/packages/add' element={<PackageForm isEdit={false} />} />
			<Route path='/packages/:packageId' element={<Package />} />
			<Route path='/packages/edit/:packageId' element={<PackageForm isEdit={true} />} />

			{/* EndProducts */}
			<Route path='/endproducts' element={<EndProducts />} />
			<Route path='/endproducts/add' element={<EndProductForm isEdit={false} />} />
			<Route path='/endproducts/:endId' element={<EndProduct />} />
			<Route path='/endproducts/edit/:endId' element={<EndProductForm isEdit={true} />} />

			{/* Homepage */}
			<Route path='/' element={<HomePage />} />
			{/* Catch All Route */}
			<Route path='/*' element={<NotFound />} />
		</Routes>
	);
}
