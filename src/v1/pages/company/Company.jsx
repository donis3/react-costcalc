import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useCompanyInfo from '../../context/company/useCompanyInfo';
import useCompanyProduction from '../../context/company/useCompanyProduction';
import useCompanyTotals from '../../context/company/useCompanyTotals';
import useModuleTheme from '../../hooks/app/useModuleTheme';
import useDefaultButtons from '../../hooks/forms/useDefaultButtons';
import CompanyEdit from './details/CompanyEdit';
import CompanyInfo from './details/CompanyInfo';

export default function Company() {
	//Calculate totals
	useCompanyProduction();
	useCompanyTotals();

	//Dependencies
	const { t } = useTranslation('pages/company');
	const { Edit, Cancel, LinkBtn } = useDefaultButtons();

	//Page State
	const [state, setState] = useState({ companyEdit: false });
	const toggleCompanyEdit = () => setState({ ...state, companyEdit: !state.companyEdit });

	//Company Data
	const { info } = useCompanyInfo();

	//Module icons
	const { icon: expenseIcon } = useModuleTheme({ module: 'expenses' });
	const { icon: employeeIcon } = useModuleTheme({ module: 'employees' });

	//Render
	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			{/* Card Header */}
			<ModuleHeader text={info.name} subtext={t('details.title')} module='company' role='main'>
				<LinkBtn text={t('employees.title')} icon={employeeIcon} to={'/company/employees'} />
				<LinkBtn text={t('expenses.title')} icon={expenseIcon} to={'/company/expenses'} />
				{/* Dynamic Button */}
				{state.companyEdit ? <Cancel onClick={toggleCompanyEdit} /> : <Edit onClick={toggleCompanyEdit} />}
			</ModuleHeader>
			{/* Body (info / form) */}
			{state.companyEdit ? <CompanyEdit handleClose={toggleCompanyEdit} /> : <CompanyInfo />}
		</Card>
	);
}
