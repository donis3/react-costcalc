import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useCompany from '../../context/company/useCompany';
import useDefaultButtons from '../../hooks/forms/useDefaultButtons';
import CompanyEdit from './details/CompanyEdit';
import CompanyInfo from './details/CompanyInfo';

export default function Company() {
	//Dependencies
	const { t } = useTranslation('pages/company');
	const { Edit, Cancel } = useDefaultButtons();

	//Page State
	const [state, setState] = useState({ companyEdit: false });
	const toggleCompanyEdit = () => setState((state) => ({ ...state, companyEdit: !state.companyEdit }));

	//Company Data
	const { info } = useCompany();

	//Render
	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			{/* Card Header */}
			<ModuleHeader text={info.name} subtext={t('details.title')} module='company' role='main'>
				{/* Dynamic Button */}
				{state.companyEdit ? <Cancel onClick={toggleCompanyEdit} /> : <Edit onClick={toggleCompanyEdit} />}
			</ModuleHeader>
			{/* Body (info / form) */}
			{state.companyEdit ? <CompanyEdit handleClose={toggleCompanyEdit} /> : <CompanyInfo />}
		</Card>
	);
}
