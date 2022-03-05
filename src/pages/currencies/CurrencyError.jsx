import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import { BiError } from 'react-icons/bi';

export default function CurrencyError() {
	const { t } = useTranslation();

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>{t('currency.title')}</h3>
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
