import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function Expenses() {
	const { t } = useTranslation('pages/company');

	return (
		<Card className='w-full px-3 py-5' shadow='shadow-lg'>
			<ModuleHeader text={t('expenses.title')} module='expenses' role='main'>
				<Link to='/company/expenses/add'>
					<Button.New name={t('expenses.name')} />
				</Link>
			</ModuleHeader>
			{/* Body */}
			<p className='opacity-80'>{t('expenses.lead')}</p>
		</Card>
	);
}
