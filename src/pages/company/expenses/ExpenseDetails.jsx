import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import ItemDetails from '../../../components/common/ItemDetails';
import NumericUnit from '../../../components/common/NumericUnit';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { useAppContext } from '../../../context/AppContext';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useCompanyExpenseCalculator from '../../../context/company/useCompanyExpenseCalculator';
import useCompanyExpenses from '../../../context/company/useCompanyExpenses';
import useConfig from '../../../hooks/app/useConfig';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useIntl from '../../../hooks/common/useIntl';
import ExpenseOptions from './ExpenseOptions';

export default function ExpenseDetails() {
	const { page } = useAppContext();
	const { expenseId } = useParams();
	const { findById } = useCompanyExpenses();
	const expense = findById(expenseId);
	const { t } = useTranslation('pages/company');
	const config = useConfig();
	const navigate = useNavigate();
	// eslint-disable-next-line no-unused-vars
	const [getOption, setOption, options] = useUiToggles();

	useEffect(() => {
		if (expense) {
			page.setBreadcrumb(expense.name);
		} else {
			toast.warning(t('error.itemNotFound', { ns: 'translation', item: t('expenses.name') }));
			navigate('/company/expenses');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!expense) return <></>;

	//Options for expense options popup
	const isForeignCurrency = expense.currency !== config.getDefaultCurrency(true);
	const expenseOptionsDisplay = isForeignCurrency ? ['period', 'localPrice'] : ['period'];
	//Render
	return (
		<Card className='w-full px-3 py-5' shadow='shadow-lg'>
			<ModuleHeader text={expense.name} subtext={t('expenseDetails.subtitle')} module='expenses' role='view'>
				<Link to={`/company/expenses/edit/${expense.expenseId}`}>
					<Button.Edit />
				</Link>
			</ModuleHeader>

			{/* Table options and total cost */}
			<div className='flex flex-col md:flex-row mt-5 gap-x-10 gap-y-5 relative '>
				<div className='flex-1'>
					<ExpenseTotals expense={expense} options={options} />
				</div>
				<div className=''>
					<ExpenseOptions options={options} setOption={setOption} display={expenseOptionsDisplay} />
				</div>
			</div>
			<ExpenseDetailsGrid expense={expense} />
		</Card>
	);
}

function ExpenseDetailsGrid({ expense = null }) {
	const { t } = useTranslation('pages/company', 'translation');
	const { displayNumber, displayMoney } = useIntl();

	return (
		<ItemDetails.Main>
			{/* Column Left */}
			<div className='flex-1 flex flex-col gap-y-5'>
				{/* Name */}
				<ItemDetails.Item title={t('expense.name')}>{expense.name}</ItemDetails.Item>
				{/* Localized Category */}
				<ItemDetails.Item title={t('expense.category')}>{t(`expenseCategories.${expense.category}`)}</ItemDetails.Item>
				{/* Period */}
				<ItemDetails.Item title={t('expense.period')}>
					{t(`periods.${expense.period}`, { ns: 'translation' })}
				</ItemDetails.Item>
			</div>
			{/* Column Right */}
			<div className='flex-1 flex flex-col gap-y-5'>
				{/* Price */}
				<ItemDetails.Item title={t('expense.price')}>
					{/* Price / unit + tax*/}
					<NumericUnit type={expense.unit !== 'other' ? expense.unit : ''} isPer short>
						{displayMoney(expense.price, expense.currency)}
					</NumericUnit>
				</ItemDetails.Item>
				{/* Tax */}
				<ItemDetails.Item title={t('expense.tax')}>{displayNumber(expense.tax, 2)}%</ItemDetails.Item>
				{/* Quantity */}

				{expense.quantity !== 1 && (
					<ItemDetails.Item title={t('expense.quantity')}>
						<NumericUnit type={expense.unit !== 'other' ? expense.unit : ''} short>
							{expense.quantity}
						</NumericUnit>
					</ItemDetails.Item>
				)}

				{/* {{period}} cost */}
				<ItemDetails.Item title={t('expense.cost', { period: t(`periods.${expense.period}`, { ns: 'translation' }) })}>
					{displayMoney(expense.cost[expense.period].amount, expense.currency)}
				</ItemDetails.Item>
				{/* {{period}} cost with tax */}
				<ItemDetails.Item
					title={t('expense.costWithTax', { period: t(`periods.${expense.period}`, { ns: 'translation' }) })}
				>
					{displayMoney(expense.cost[expense.period].amountWithTax, expense.currency)}
				</ItemDetails.Item>
			</div>
		</ItemDetails.Main>
	);
}

function ExpenseTotals({ expense = null, options = null }) {
	const { displayMoney } = useIntl();
	const { t } = useTranslation('pages/company', 'translation');
	const { calculateCost, defaultCost } = useCompanyExpenseCalculator();
	const { periods } = useCompanyDefaults();
	const config = useConfig();

	//Extract period and currency
	const period = periods.includes(options?.showPeriod) ? options.showPeriod : periods[0];
	const currentPeriodText = t('periods.' + options?.showPeriod, { ns: 'translation' });
	const currency = options?.localPrice ? config.getDefaultCurrency(true) : expense?.currency;

	//Get money values
	let total = 0;
	let totalWithTax = 0;

	const costs = expense ? calculateCost(expense, options?.localPrice) : defaultCost;
	if (costs && period in costs) {
		total = costs[period].amount;
		totalWithTax = costs[period].amountWithTax;
	}

	return (
		<div className='w-full flex items-center justify-start mb-3 mt-3'>
			<div className='stats border flex-1'>
				<div className='stat'>
					<div className='stat-title'>{t('expensesTable.periodCost', { period: currentPeriodText })}</div>
					<div className='stat-value'>{displayMoney(total, currency)}</div>
					<div className='stat-desc'>
						{t('labels.priceWithTax', {
							ns: 'translation',
							price: displayMoney(totalWithTax, currency),
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
