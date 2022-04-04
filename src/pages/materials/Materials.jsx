import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../components/common/Card';
import MaterialTable from './MaterialTable';

import Button from '../../components/common/Button';

import { Link } from 'react-router-dom';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function Materials() {
	//Translation
	const { t } = useTranslation('pages/materials');

	//JSX
	return (
		<>
			<Card className='w-full px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={t('title')} module='materials' role='main'>
					<Link to='/materials/add' className='mr-1'>
						<Button.New name={t('name')} />
					</Link>
				</ModuleHeader>
				<p className='opacity-80'>{t('lead')}</p>

				<MaterialTable />
			</Card>
		</>
	);
}
