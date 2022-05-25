import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useCompanyProduction from '../../context/company/useCompanyProduction';
import useCompanyTotals from '../../context/company/useCompanyTotals';
import ExpensesTable from './expenses/ExpensesTable';

export default function Expenses() {
	const { t } = useTranslation('pages/company');
	//Calculate totals
	useCompanyProduction();
	useCompanyTotals();

	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			<ModuleHeader text={t('expenses.title')} module='expenses' role='main'>
				<Link to='/company/expenses/chart'>
					<Button.PieChart forceIcon>{t('expenses.chart')}</Button.PieChart>
				</Link>
				<Link to='/company/expenses/add'>
					<Button.New name={t('expenses.name')} />
				</Link>
			</ModuleHeader>

			{/* Table */}
			<ExpensesTable />
		</Card>
	);
}
