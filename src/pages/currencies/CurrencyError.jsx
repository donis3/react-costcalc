import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import { BiError } from 'react-icons/bi';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function CurrencyError() {
	const { t } = useTranslation();

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={t('currency.title')} module='currency' role='view' />
				
				<div className='flex justify-between gap-x-10 items-end'>
					<p className='opacity-80'>{t('currency.noCurrencies')}</p>
					<p className='w-1/4 text-6xl'>
						<BiError className='text-error-content' />
					</p>
				</div>
			</Card>
		</>
	);
}
