import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useCurrency from '../../context/currency/useCurrency';
import { FaExchangeAlt as ExchangeIcon } from 'react-icons/fa';

export default function Currencies() {
	const { t } = useTranslation();
	const { currencies } = useCurrency();
	let currencyArray = [];
	if (currencies && currencies.enabled?.length > 0) {
		currencyArray = [...currencies.enabled];
	}

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('currency.title')} module='currency' role='view' />

				<p className='opacity-80'>
					{currencyArray.length > 0 ? t('currency.selectCurrency') : t('currency.noSelectableCurrency')}
				</p>
				<div className='w-full  my-5 flex flex-wrap gap-5'>
					{currencyArray.map((cur) => (
						<SelectCurBtn key={cur} currency={cur} defaultCurrency={currencies.default} />
					))}
				</div>
			</Card>
		</>
	);
}

function SelectCurBtn({ currency, defaultCurrency }) {
	if (!currency || !defaultCurrency) {
		return <span>CURRENCY_ERR</span>;
	}
	return (
		<Link to={`/currency/${currency}`} className='btn btn-primary gap-2 text-lg'>
			<span>{currency}</span>
			<ExchangeIcon className='' />
			<span>{defaultCurrency}</span>
		</Link>
	);
}

SelectCurBtn.defaultProps = {
	currency: '',
	defaultCurrency: '',
};
