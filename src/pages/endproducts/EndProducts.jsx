import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import EndProductsTable from './table/EndProductsTable';

export default function EndProducts() {
	const { t } = useTranslation('pages/endproducts');

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={t('title')} module='endproducts' role='main'>
					<Link to='/endproducts/add'>
						<Button.New name={t('name')} />
					</Link>
				</ModuleHeader>
				{/* Lead Text */}
				<p className='opacity-80'>{t('lead')}</p>
				<EndProductsTable />
			</Card>
		</>
	);
}
