import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Form from '../../../components/forms/Form';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { useAppContext } from '../../../context/AppContext';
import useIntl from '../../../hooks/common/useIntl';
import useExpenseForm from './useExpenseForm';

export default function ExpenseForm({ isEdit = false }) {
	const { t } = useTranslation('pages/company', 'translation');
	const { page } = useAppContext();
	const { expenseId } = useParams();
	const { selectData, register, getError, handlers, cost } = useExpenseForm();
	const { displayMoney } = useIntl();

	//Set breadcrumb if an expense is loaded
	useEffect(() => {
		if (isEdit && expenseId) {
			page.setBreadcrumb('Expense Name');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
			<ModuleHeader
				module='expenses'
				text={isEdit ? t('expenses.formTitleEdit') : t('expenses.formTitleAdd')}
				role={isEdit ? 'edit' : 'add'}
			/>
			<p>TODO: form Schema, dispatch actions</p>

			{/* Body */}
			<Form onSubmit={handlers.submit} onDelete={isEdit ? handlers.delete : null} onReset={handlers.reset}>
				{/* Details Section */}
				<Form.Section title={t('expenses.formSectionDetails')}>
					{/* Field: name */}
					<Form.Control label={t('expense.name')} error={getError('name')}>
						<Form.Text {...register({ field: 'name', isControlled: false })} />
					</Form.Control>
					{/* Field: Category */}
					<Form.Control label={t('expense.category')} error={getError('category')}>
						<Form.Select {...register({ field: 'category', isControlled: false })} options={selectData.category} />
					</Form.Control>
					{/* Field: Period */}
					<Form.Control label={t('expense.period')} error={getError('period')}>
						<Form.Select {...register({ field: 'period', isControlled: false })} options={selectData.period} />
					</Form.Control>
				</Form.Section>

				{/* Cost Section */}
				<Form.Section title={t('expenses.formSectionCost')}>
					{/* Field: price & currency */}
					<Form.ControlGroup label={t('expense.price')} error={getError(['price', 'currency'])}>
						<Form.Number {...register({ field: 'price', isControlled: false })} />
						<Form.Select {...register({ field: 'currency', isControlled: false })} options={selectData.currencies} />
					</Form.ControlGroup>

					<Form.Row>
						{/* Field: qty */}
						<Form.Control label={t('expense.quantity')} error={getError('quantity')}>
							<Form.Number {...register({ field: 'quantity', isControlled: false })} />
						</Form.Control>

						{/* Field: unit */}
						<Form.Control label={t('expense.unit')} error={getError('unit')}>
							<Form.Select {...register({ field: 'unit', isControlled: false })} options={selectData.unit} />
						</Form.Control>
					</Form.Row>
					{/* Field: tax */}
					<Form.Control label={t('expense.tax')} error={getError('tax')}>
						<Form.Number {...register({ field: 'tax', isControlled: false })} />
					</Form.Control>
				</Form.Section>

				{/* Calculations */}
				<Form.Row>
					<div className='stat flex-1 border-2 rounded-md'>
						<div className='stat-title'>{t('expenses.formMonthlyTitle')}</div>
						<div className='stat-value'>{displayMoney(cost?.m?.amount)}</div>
						<div className='stat-desc'>
							{t('labels.priceWithTax', { ns: 'translation', price: displayMoney(cost?.m?.amountWithTax) })}
						</div>
					</div>
					<div className='stat flex-1 border-2 rounded-md'>
						<div className='stat-title'>{t('expenses.formAnnualTitle')}</div>
						<div className='stat-value'>{displayMoney(cost?.y?.amount)}</div>
						<div className='stat-desc'>
							{t('labels.priceWithTax', { ns: 'translation', price: displayMoney(cost?.y?.amountWithTax) })}
						</div>
					</div>
				</Form.Row>
			</Form>
		</Card>
	);
}
