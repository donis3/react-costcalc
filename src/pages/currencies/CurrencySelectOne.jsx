import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import { useCurrencyContext } from '../../context/MainContext';
import { Link } from 'react-router-dom';
import CurrencyError from './CurrencyError';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function CurrencySelectOne() {
	const { t } = useTranslation();
	const { currencies } = useCurrencyContext();
	if (!currencies || 'enabledCurrencies' in currencies === false || currencies.enabledCurrencies.length === 0) {
		return <CurrencyError />;
	}

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={t('currency.title')} module='currency' role='view' />
				
				<p className='opacity-80'>{t('currency.selectCurrency')}</p>
				<div className='w-full  my-5 grid gap-5 grid-flow-col grid-cols-4'>
					{currencies.enabledCurrencies.map((item, i) => {
						return (
							<Link key={i} to={`/currency/${item}`} className='btn btn-primary'>
								{/* afafs */}
								{`${item} / ${currencies.defaultCurrency}`}
							</Link>
						);
					})}
				</div>
			</Card>
		</>
	);
}
