import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import Button from '../../components/common/Button';


import MaterialTable from './MaterialTable';

export default function Materials() {
	//Translation
	const { t } = useTranslation('pages/materials');
	

	//JSX
	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
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
