import { useContext, useEffect, useMemo } from 'react';
import useConfig from '../../hooks/app/useConfig';
import useCurrencyConversion from '../../hooks/app/useCurrencyConversion';
import { CompanyContext } from '../CompanyContext';
import useCompanyDefaults from './useCompanyDefaults';
import useCompanyExpenseCalculator from './useCompanyExpenseCalculator';

/**
 * Calculate total annual expense cost, total annual labour cost and other employees annual cost
 * save at company.totals
 * @returns
 */
export default function useCompanyTotals() {
	const [company, dispatch] = useContext(CompanyContext);
	const { totals: defaultTotals } = useCompanyDefaults();
	const { calculateCost } = useCompanyExpenseCalculator();
	const { convert, defaultCurrency } = useCurrencyConversion();
	const config = useConfig();

	//Find labour departments for labour cost separation
	const departments = config.get('company.departments');
	const labourDepartments = departments.reduce((acc, dept) => (dept.isLabour ? [...acc, dept.name] : acc), []);

	/**
	 * Go through each expense and calculate annual cost in local currency,
	 * return total cost
	 * @returns
	 */
	function getTotalExpense() {
		const { expenses = [] } = company;
		return expenses.reduce(
			(acc, expense) => {
				const cost = calculateCost(expense, true);
				if (cost && 'y' in cost) {
					return {
						expenses: acc.expenses + cost.y.amount,
						expensesWithTax: acc.expensesWithTax + cost.y.amountWithTax,
					};
				}
				return acc;
			},
			{ expenses: 0, expensesWithTax: 0 }
		);
	}

	/**
	 * Go through each employee and determine if they are labourer or not
	 * add employees and labourers salaries separately
	 * @returns {object}
	 */
	function getTotalSalary() {
		const { employees = [] } = company;
		return employees.reduce(
			(acc, employee) => {
				//Extract employee data and determine if employee is labourer
				const { currency = defaultCurrency, net = 0, gross = 0, department } = employee;
				const isLabour = labourDepartments.includes(department);
				const isForeign = currency !== defaultCurrency;

				//Convert to local currency if needed
				const localNet = isForeign ? convert(net, currency).amount : net;
				const localGross = isForeign ? convert(gross, currency).amount : gross;

				if (isLabour) {
					return { ...acc, labourNet: acc.labourNet + localNet, labourGross: acc.labourGross + localGross };
				} else {
					return { ...acc, salariesNet: acc.salariesNet + localNet, salariesGross: acc.salariesGross + localGross };
				}
			},
			{ labourNet: 0, labourGross: 0, salariesNet: 0, salariesGross: 0 }
		);
	}

	//memorization's
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const salariesMemoized = useMemo(() => getTotalSalary(), [company.employees]);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const expensesMemoized = useMemo(() => getTotalExpense(), [company.expenses]);

	/**
	 * Get all expenses and salaries, send them to dispatch
	 */
	useEffect(() => {
		dispatch({
			type: 'UpdateCompanyTotals',
			payload: {
				...defaultTotals,
				currency: defaultCurrency,
				...expensesMemoized,
				...salariesMemoized,
			},
			error: function (code = '') {
				if (!config.get('debug.companyTotals')) return;
				console.log(`Failed calculating company totals due to: ${code}`);
			},
			success: function () {
				if (!config.get('debug.companyTotals')) return;
				console.log('Updated company totals');
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {};
}
