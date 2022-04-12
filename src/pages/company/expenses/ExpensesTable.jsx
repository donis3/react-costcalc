import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ThSortable from '../../../components/common/ThSortable';
import useCompanyExpenseCalculator from '../../../context/company/useCompanyExpenseCalculator';
import useCompanyExpenses from '../../../context/company/useCompanyExpenses';
import useConfig from '../../../hooks/app/useConfig';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useIntl from '../../../hooks/common/useIntl';

export default function ExpensesTable({ options }) {
	const { getAll, sorting } = useCompanyExpenses();
	const { t } = useTranslation('pages/company');
	const [sortingState, sortBy] = useSortTableByField('expenses', sorting.fields, sorting.default);

	return (
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
					{getAll({ ...sortingState, category: options.showCategory }).map((expense, index) => (
						<ExpenseTableRow key={index} expense={expense} options={options} />
					))}
				</tbody>
			</table>
		</div>
	);
}

function ExpenseTableRow({ expense, options }) {
	const { t } = useTranslation('pages/company');
	const config = useConfig();
	const { displayMoney } = useIntl();
	const { defaultCost } = useCompanyExpenseCalculator();
	if (!expense || 'expenseId' in expense === false) return <></>;

	const { expenseId, name, localCategory, localPeriod, cost = defaultCost } = expense;
	const displayCost = { currency: config.getDefaultCurrency(true), amount: 0, amountWithTax: 0 };
	if (cost && options.showPeriod in cost) {
		displayCost.currency = cost[options.showPeriod].currency;
		displayCost.amount = cost[options.showPeriod].amount;
		displayCost.amountWithTax = cost[options.showPeriod].amountWithTax;
	}

	return (
		<tr className='hover'>
			<td className='whitespace-normal truncate'>
				<Link to={`/company/expenses/${expenseId}`} className='link-hover'>
					{name}
				</Link>
			</td>
			<td>{localCategory}</td>
			<td>{localPeriod}</td>
			<td>{displayMoney(displayCost.amount, displayCost.currency)}</td>
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
