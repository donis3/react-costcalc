import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import ItemDetails from '../../../components/common/ItemDetails';
import NumericUnit from '../../../components/common/NumericUnit';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { useAppContext } from '../../../context/AppContext';
import useCompanyExpenses from '../../../context/company/useCompanyExpenses';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useIntl from '../../../hooks/common/useIntl';
import ExpenseOptions from './ExpenseOptions';

export default function ExpenseDetails() {
	const { page } = useAppContext();
	const { expenseId } = useParams();
	const { findById } = useCompanyExpenses();
	const expense = findById(expenseId);
	const { t } = useTranslation('pages/company');
	// eslint-disable-next-line no-unused-vars
	const [getOption, setOption, options] = useUiToggles();

	useEffect(() => {
		if (expense) {
			page.setBreadcrumb(expense.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Card className='w-full px-3 py-5' shadow='shadow-lg'>
			<ModuleHeader text={expense.name} subtext={t('expenseDetails.subtitle')} module='expenses' role='view'>
				<Button.Edit />
			</ModuleHeader>

			<ExpenseOptions options={options} setOption={setOption} display={['period', 'options']} />
			TODO: use options actively, edit link
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
					{/* Price / unit */}
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
