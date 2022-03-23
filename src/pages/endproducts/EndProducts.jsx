import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import EndProductsTable from './table/EndProductsTable';

export default function EndProducts() {
	const { t } = useTranslation('pages/endproducts');

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				{/* Page Header */}
				<div className='w-full flex justify-between'>
					<h3 className='text-2xl py-2 font-semibold'>{t('title')}</h3>
					<Link to='/endproducts/add'>
						<Button.New name={t('name')} />
					</Link>
				</div>
				{/* Lead Text */}
				<p className='opacity-80'>{t('lead')}</p>
				<EndProductsTable />
			</Card>
		</>
	);
}
