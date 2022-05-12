import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCompany from '../../../context/company/useCompany';
import {
	useEndProductsContext,
	useMaterialContext,
	usePackagesContext,
	useProductsContext,
	useRecipesContext,
} from '../../../context/MainContext';

export default function useModuleGrid() {
	const { t } = useTranslation('pages/homepage');
	const { company } = useCompany();
	const { products } = useProductsContext();
	const { Materials } = useMaterialContext();
	const { recipes } = useRecipesContext();
	const { packages } = usePackagesContext();
	const { endProducts } = useEndProductsContext();

	//================// Helper Methods //==================//
	function getCount(data) {
		if (!Array.isArray(data)) return 0;
		return data.length;
	}

	//================// Result Object //==================//
	const result = {
		employees: 0,
		expenses: 0,
		products: 0,
		endproducts: 0,
		materials: 0,
		recipes: 0,
		packages: 0,
	};

	//================// Get Data from Repos//==================//
	result.employees = useMemo(() => getCount(company?.employees), [company]);
	result.expenses = useMemo(() => getCount(company?.expenses), [company]);
	result.endproducts = useMemo(() => getCount(endProducts?.data), [endProducts]);
	result.products = useMemo(() => getCount(products?.data), [products]);
	result.materials = useMemo(() => getCount(Materials?.materials), [Materials]);
	result.recipes = useMemo(() => getCount(recipes?.recipesState), [recipes]);
	result.packages = useMemo(() => getCount(packages?.data), [packages]);

	//================// Combine other data /==================//

	const data = [
		{
			module: 'employees',
			label: t('miniStats.employees'),
			text: result.employees,
			link: '/company/employees',
		},
		{
			module: 'expenses',
			label: t('miniStats.expenses'),
			text: result.expenses,
			link: '/company/expenses',
		},
		{
			module: 'endproducts',
			label: t('miniStats.products'),
			text: result.endproducts,
			link: '/endproducts',
		},
		{
			module: 'recipes',
			label: t('miniStats.recipes'),
			text: result.recipes,
			link: '/recipes',
		},
		{
			module: 'materials',
			label: t('miniStats.materials'),
			text: result.materials,
			link: '/materials',
		},
		{
			module: 'packages',
			label: t('miniStats.packages'),
			text: result.packages,
			link: '/packages',
		},
	];

	return data;
}
