import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCompany from '../../../context/company/useCompany';
import {
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
		materials: 0,
		recipes: 0,
		packages: 0,
	};

	//================// Get Data from Repos//==================//
	result.employees = useMemo(() => getCount(company?.employees), [company]);
	result.expenses = useMemo(() => getCount(company?.expenses), [company]);
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
			module: 'products',
			label: t('miniStats.products'),
			text: result.products,
			link: '/products',
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
