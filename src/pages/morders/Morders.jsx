import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useMorders from '../../context/morders/useMorders';

export default function Morders() {
	const { t } = useTranslation('pages/morders');
	const { morders } = useMorders();
	console.log('Manufacturing Orders:', morders);

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('title')} module='morders' role='main'>
					<Link to='/morders/add' className='mr-1'>
						<Button.New name={t('name')} />
					</Link>
				</ModuleHeader>
				<p className='opacity-80'>{t('lead')}</p>
				All orders
			</Card>
		</>
	);
}
