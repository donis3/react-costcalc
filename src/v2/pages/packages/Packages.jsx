import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import usePackages from '../../context/packages/usePackages';
import PackagesTable from './table/PackagesTable';

export default function Packages() {
	const { t } = useTranslation('pages/packages');
	const packages = usePackages();

	/**
	 * When a package is added or updated, its cost will be 0 or unchanged
	 * This function will go through each package, calculate its current cost and do a batch update
	 */
	useEffect(() => {
		//Needs to be called when exchange rates change as well. Maybe use events?
		packages.reCalculateCosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('packages.title')} module='packages' role='main'>
					{/* Links */}
					<Link to='/packages/add'>
						<Button.New name={t('name')} />
					</Link>
				</ModuleHeader>
				{/* Lead Text */}
				<p className='opacity-80'>{t('packages.lead')}</p>
				{/* Content */}
				<PackagesTable packages={packages} />
			</Card>
		</>
	);
}
