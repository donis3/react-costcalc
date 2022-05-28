import { useTranslation } from 'react-i18next';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useCompanyExpenses from '../../../context/company/useCompanyExpenses';

export default function useExpenseChart({ category = null, period = 'y' } = {}) {
	const { t } = useTranslation('pages/company', 'translation');
	const { getAll, getAvailableCategories } = useCompanyExpenses();
	const { periods, periodCoefficients } = useCompanyDefaults();
	const expenses = getAll({ category });
	const availableCategories = getAvailableCategories() || [];
	const categoryName = !category ? t('expenseCategories.all') : t(`expenseCategories.${category}`);
	period = periods.includes(period) ? period : periods[0];
	const includeTax = true;

	//=====================// Select Arrays //=====================//
	const selectCategoryArray = availableCategories.map((cat) => {
		return { name: t(`expenseCategories.${cat}`), value: cat };
	});
	selectCategoryArray.unshift({ name: t('expenseCategories.all'), value: '' });

	const selectPeriodArray = periods.map((p) => {
		return { name: t(`periods.${p}`, { ns: 'translation' }), value: p };
	});

	//=====================// Chart Data //=====================//

	//=====================// Exports //=====================//
	return {
		expenses,
		selectCategoryArray,
		categoryName,
		selectPeriodArray,
		getChartData: () => {
			if (availableCategories.includes(category)) {
				return getCategoryChartData(expenses, category, includeTax, period, periodCoefficients);
			} else {
				return getAllCategoriesChartData(expenses, includeTax, period, periodCoefficients, t);
			}
		},
	};
}

/**
 * Get chart data for a given category. Not all categories.
 * Chart will be for individual expense items
 * @param {*} category
 */
function getCategoryChartData(expenses = [], category, includeTax = true, period, periodCoefficients) {
	const chartData = { labels: [], data: [] };
	//Validation
	if (!category || category === 'all') return chartData;
	if (!Array.isArray(expenses) || expenses.length === 0 || 'expenseId' in expenses[0] === false) {
		return chartData;
	}
	if (!period || !periodCoefficients || period in periodCoefficients === false) {
		return chartData;
	}

	//Calculate expenses for each category
	expenses.forEach((expense) => {
		//Get cost for this expense in this period
		const { localAnnualCost, localAnnualCostWithTax } = expense;
		const annualCost = includeTax ? localAnnualCostWithTax : localAnnualCost;
		const periodCost = annualCost / periodCoefficients[period];

		//Add expense item to chart data
		chartData.labels.push(expense.name);
		chartData.data.push(periodCost);
	});

	return chartData;
}

/**
 * Get chart data for all categories
 * Categories will be individual chart items
 * @param {*} category
 */
function getAllCategoriesChartData(expenses = [], includeTax = true, period, periodCoefficients, t) {
	const chartData = { labels: [], data: [] };
	const costPerCategory = {};
	//Validation
	if (!Array.isArray(expenses) || expenses.length === 0 || 'expenseId' in expenses[0] === false) {
		return chartData;
	}
	if (!period || !periodCoefficients || period in periodCoefficients === false) {
		return chartData;
	}
	if (!t || typeof t !== 'function') return chartData;

	//Calculate expenses for each category
	expenses.forEach((expense) => {
		//Get cost for this expense in this period
		const { localAnnualCost, localAnnualCostWithTax } = expense;
		const annualCost = includeTax ? localAnnualCostWithTax : localAnnualCost;
		const periodCost = annualCost / periodCoefficients[period];

		//Add this cost to corresponding category
		if (expense.category in costPerCategory) {
			costPerCategory[expense.category] += periodCost;
		} else {
			costPerCategory[expense.category] = periodCost;
		}
	});
	//Reduce all categories to labels and data arrays and return
	return Object.keys(costPerCategory).reduce(
		(acc, cat) => {
			//Must localize category name
			return {
				labels: [...acc.labels, t(`expenseCategories.${cat}`)],
				data: [...acc.data, costPerCategory[cat]],
			};
		},
		{ labels: [], data: [] }
	);
}
