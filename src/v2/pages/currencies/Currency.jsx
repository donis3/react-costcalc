import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function Currency() {
	const { t } = useTranslation();

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('currency.title')} module='currency' role='view' />

				<p className='opacity-80'>{t('currency.selectCurrency')}</p>
				<div className='w-full  my-5 grid gap-5 grid-flow-col grid-cols-4'>
					<SelectCurBtn />
				</div>
			</Card>
		</>
	);
}

function SelectCurBtn() {
	return <button>cur</button>;
}
