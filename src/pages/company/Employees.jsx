import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useCompanyEmployees from '../../context/company/useCompanyEmployees';
import EmployeeTable from './employees/EmployeeTable';

export default function Employees() {
	const { t } = useTranslation('pages/company');
	const { employees } = useCompanyEmployees();

	return (
		<>
			<Card className='w-full px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={t('employees.title')} module='employees' role='main'>
					<Link to='/company/employees/add'>
						<Button.New name={t('employees.name')} />
					</Link>
				</ModuleHeader>
				{/* Body */}
				<p className='opacity-80'>{t('employees.lead')}</p>

				<EmployeeTable />
			</Card>
		</>
	);
}
