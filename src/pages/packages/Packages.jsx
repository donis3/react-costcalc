import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { usePackagesContext } from '../../context/MainContext';

export default function Packages() {
	const { t } = useTranslation('pages/packages');
	const { packages } = usePackagesContext();
	// <Button.Reset onClick={packages.clearPackages} /> // Clear all packages

	console.log(packages.getAllSorted({ field: 'cost', asc: false }));

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				{/* Page Header */}
				<div className='w-full flex justify-between'>
					<h3 className='text-2xl py-2 font-semibold'>{t('packages.title')}</h3>
					<Link to='/packages/add'>
						<Button.New name={t('name')} />
					</Link>
				</div>
				{/* Lead Text */}
				<p className='opacity-80'>{t('packages.lead')}</p>
			</Card>
		</>
	);
}
