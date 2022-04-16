import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ThSortable from '../../../components/common/ThSortable';
import TablePagination from '../../../components/tables/TablePagination';

import useCompanyExpenseCalculator from '../../../context/company/useCompanyExpenseCalculator';
import useCompanyExpenses from '../../../context/company/useCompanyExpenses';

import useCurrencyConversion from '../../../hooks/app/useCurrencyConversion';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useIntl from '../../../hooks/common/useIntl';
import usePagination from '../../../hooks/common/usePagination';
import ExpenseTotal from './components/ExpenseTotal';
import ExpenseOptions from './ExpenseOptions';

export default function ExpensesTable() {
	// eslint-disable-next-line no-unused-vars
	const [getOption, setOption, options] = useUiToggles();
	const { getAll, sorting } = useCompanyExpenses();
	const { t } = useTranslation('pages/company');
	const [sortingState, sortBy] = useSortTableByField('expenses', sorting.fields, sorting.default);
	const expenses = getAll({ ...sortingState, category: options.showCategory });

	const { rows, currentPage, onPageChange, totalPages, count } = usePagination({
		table: expenses,
		name: 'ExpensesTable',
	});

	return (
		<>
			{/* Table options and total cost */}
			<div className='flex flex-col md:flex-row mt-5 gap-x-10 relative '>
				<div className='flex-1'>
					<ExpenseTotal expenses={expenses} options={options} />
				</div>
				<div className='flex-1'>
					<ExpenseOptions options={options} setOption={setOption} />
				</div>
			</div>
			{/* Table */}
			<div className='overflow-x-auto my-10'>
				<table className='table table-zebra w-full md:table-normal  table-compact'>
					<thead>
						<tr>
							<ThSortable className='w-4/12' field={sorting.fields[1]} sortingState={sortingState} handleSort={sortBy}>
								{t('expense.name')}
							</ThSortable>

							<ThSortable className='w-3/12' field={sorting.fields[2]} sortingState={sortingState} handleSort={sortBy}>
								{t('expense.category')}
							</ThSortable>

							<ThSortable className='w-2/12' field={sorting.fields[3]} sortingState={sortingState} handleSort={sortBy}>
								{t('expense.period')}
							</ThSortable>

							<ThSortable className='w-2/12' field={sorting.fields[4]} sortingState={sortingState} handleSort={sortBy}>
								{t('expense.amount')}
							</ThSortable>

							<ThSortable className='w-1/12'></ThSortable>
						</tr>
					</thead>
					<tbody>
						{rows.map((expense, index) => (
							<ExpenseTableRow key={index} expense={expense} options={options} />
						))}
					</tbody>
				</table>
				<TablePagination current={currentPage} total={totalPages} handler={onPageChange} itemCount={count} />
			</div>
		</>
	);
}

function ExpenseTableRow({ expense, options }) {
	const { displayMoney } = useIntl();
	const { defaultCost } = useCompanyExpenseCalculator();
	const { convert, defaultCurrency } = useCurrencyConversion();
	if (!expense || 'expenseId' in expense === false) return <></>;

	const { expenseId, name, localCategory, period, localPeriod, cost = defaultCost, currency } = expense;
	//Convert to local currency toggle
	let local = false;
	if (currency && currency !== defaultCurrency) {
		if (options?.localPrice === true) local = true;
	}
	//Get cost for this period
	let displayCost = {};
	if (cost && period in cost) {
		displayCost = cost[period];
	}
	//Convert if needed
	const net = local ? convert(displayCost.amount, displayCost.currency).amount : displayCost.amount;
	const taxed = local ? convert(displayCost.amountWithTax, displayCost.currency).amount : displayCost.amountWithTax;
	const activeCurrency = local ? defaultCurrency : currency;
	return (
		<tr className='hover'>
			<td className='whitespace-normal truncate'>
				<Link to={`/company/expenses/${expenseId}`} className='link-hover'>
					{name}
				</Link>
			</td>
			<td>{localCategory}</td>
			<td>{localPeriod}</td>
			<td>{options?.showTax === true ? displayMoney(taxed, activeCurrency) : displayMoney(net, activeCurrency)}</td>
			<td className='flex flex-wrap gap-x-1'>
				<Link to={`/company/expenses/edit/${expenseId}`}>
					<Button.EditSmall />
				</Link>
			</td>
		</tr>
	);
}

//Defaults
ExpensesTable.defaultProps = {
	options: { showPeriod: 'y', showCategory: [] },
};
ExpenseTableRow.defaultProps = {
	expense: null,
};
