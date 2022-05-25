import React from 'react';
import { Route, Routes } from 'react-router-dom';
import useSettings from '../context/settings/useSettings';

//Settings
import Settings from '../pages/settings/Settings';

//Currency
import Currencies from '../pages/currencies/Currencies';
import Currency from '../pages/currencies/Currency';

//Other
import MaterialForm from '../pages/materials/form/MaterialForm';
import Material from '../pages/materials/Material';
import Materials from '../pages/materials/Materials';
import About from '../pages/other/About';
import Contact from '../pages/other/Contact';
import Demo from '../pages/other/Demo';
import Help from '../pages/other/Help';
import NotFound from '../pages/other/NotFound';
import Welcome from '../pages/other/Welcome';

//Products
import Products from '../pages/products/Products';

//Recipes
import Recipes from '../pages/recipes/Recipes';
import Recipe from '../pages/recipes/Recipe';
import RecipeForm from '../pages/recipes/form/RecipeForm';

//Packages
import Packages from '../pages/packages/Packages';
import PackageForm from '../pages/packages/PackageForm';
import Package from '../pages/packages/Package';

//EndProducts
import EndProducts from '../pages/endproducts/EndProducts';
import EndProductForm from '../pages/endproducts/EndProductForm';
import EndProduct from '../pages/endproducts/EndProduct';

//Company
import Company from '../pages/company/Company';

//Employees
import Employees from '../pages/company/Employees';
import EmployeeDetails from '../pages/company/employees/EmployeeDetails';
import EmployeeForm from '../pages/company/employees/EmployeeForm';

//Expenses
import Expenses from '../pages/company/Expenses';
import ExpenseForm from '../pages/company/expenses/ExpenseForm';
import ExpenseDetails from '../pages/company/expenses/ExpenseDetails';
import ExpenseChart from '../pages/company/expenses/ExpenseChart';
import HomePage from '../pages/HomePage';
import System from '../pages/system/System';

export default function Router() {
	//Detect first time setup
	const { setupComplete } = useSettings();

	if (!setupComplete) return <WelcomeRouter />;
	return (
		<Routes>
			{/* Company */}
			<Route path='/company' element={<Company />} />

			{/* Company > Expenses */}
			<Route path='/company/expenses' element={<Expenses />} />
			<Route path='/company/expenses/add' element={<ExpenseForm />} />
			<Route path='/company/expenses/edit/:expenseId' element={<ExpenseForm isEdit={true} />} />
			<Route path='/company/expenses/:expenseId' element={<ExpenseDetails />} />
			<Route path='/company/expenses/chart' element={<ExpenseChart />} />

			{/* Company > Employees */}
			<Route path='/company/employees' element={<Employees />} />
			<Route path='/company/employees/add' element={<EmployeeForm isEdit={false} />} />
			<Route path='/company/employees/edit/:employeeId' element={<EmployeeForm isEdit={true} />} />
			<Route path='/company/employees/:employeeId' element={<EmployeeDetails />} />

			{/* EndProducts */}
			<Route path='/endproducts' element={<EndProducts />} />
			<Route path='/endproducts/add' element={<EndProductForm isEdit={false} />} />
			<Route path='/endproducts/:endId' element={<EndProduct />} />
			<Route path='/endproducts/edit/:endId' element={<EndProductForm isEdit={true} />} />

			{/* ===================== Packages  ===================== */}
			<Route path='/packages' element={<Packages />} />
			<Route path='/packages/:packageId' element={<Package />} />
			<Route path='/packages/add' element={<PackageForm isEdit={false} />} />
			<Route path='/packages/edit/:packageId' element={<PackageForm isEdit={true} />} />

			{/* ===================== Recipes  ===================== */}
			<Route path='/recipes' element={<Recipes />} />
			<Route path='/recipes/:recipeId' element={<Recipe />} />
			<Route path='/recipes/add/' element={<RecipeForm />} />
			<Route path='/recipes/edit/:recipeId' element={<RecipeForm isEdit={true} />} />

			{/* ===================== Products  ===================== */}
			<Route path='/products' element={<Products />} />

			{/* ===================== Materials  ===================== */}
			<Route path='/materials' element={<Materials />} />
			<Route path='/materials/:materialId' element={<Material />} />
			<Route path='/materials/add' element={<MaterialForm />} />
			<Route path='/materials/edit/:materialId' element={<MaterialForm isEdit={true} />} />

			{/* ===================== Currencies  ===================== */}
			<Route path='/currency' element={<Currencies />} />
			<Route path='/currency/:currency' element={<Currency />} />

			{/* ===================== Settings  ===================== */}
			<Route path='/settings' element={<Settings />} />

			{/* ===================== System  ===================== */}
			<Route path='/system' element={<System />} />

			{/* ===================== Other Routes  ===================== */}
			<Route path='/demo' element={<Demo />} />
			<Route path='/contact' element={<Contact />} />
			<Route path='/about' element={<About />} />
			<Route path='/help' element={<Help />} />
			<Route path='/' element={<HomePage />} />
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
