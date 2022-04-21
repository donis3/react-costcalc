import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import PackagesTable from './table/PackagesTable';

export default function Packages() {
	const { t } = useTranslation('pages/packages');

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
				<PackagesTable />
			</Card>
		</>
	);
}
