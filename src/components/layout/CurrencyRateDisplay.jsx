import React, { useState } from 'react';
import { MdRefresh } from 'react-icons/md';

import useIntl from '../../hooks/common/useIntl';
import { FaCaretUp, FaCaretDown, FaSpinner } from 'react-icons/fa';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrencyContext } from '../../context/MainContext';
import useTcmbToday from '../../hooks/app/useTcmbToday';

export default function CurrencyRateDisplay() {
	const [showDetails, setShowDetails] = useState(false);
	const { currencies } = useCurrencyContext();
	const { loading, fetchTcmbRates } = useTcmbToday();
	const { t } = useTranslation('translation');

	//No currency conversion available
	if (!currencies || currencies.enabledCurrencies === 0) {
		return <></>;
	}

	if (loading === true) {
		//Loading
		return (
			<div className='flex gap-x-2 items-center'>
				<span className='opacity-50'>{t('currency.fetchWaiting')}...</span>
				<FaSpinner className='animate-spin' />
			</div>
		);
	}

	return (
		<div className=''>
			<ul
				className='list-none flex gap-x-2 font-normal justify-end flex-row-reverse md:flex-row'
				onMouseOver={() => setShowDetails(true)}
				onMouseOut={() => setShowDetails(false)}
			>
				{/* Last updated & refresh buttons */}
				<CurrencyDisplayDetails show={showDetails} action={fetchTcmbRates} latestDate={currencies.getLatestDate()} />

				{/* Rate Items */}
				{currencies.enabledCurrencies.map((cur, i) => {
					return (
						<CurrencyDisplayItem
							key={i}
							currency={cur}
							from={currencies.symbol(cur)}
							to={currencies.symbol(currencies.defaultCurrency)}
							rateData={currencies.getRateFor({ from: cur, history: 1 })}
						/>
					);
				})}
			</ul>
		</div>
	);
}

//Display refresh button
const CurrencyDisplayDetails = ({ show = false, action = null, latestDate = null }) => {
	const { t } = useTranslation();
	const { displayDate } = useIntl();

	let detailsText = t('currency.lastUpdateError');
	if (latestDate) {
		const updateDate = displayDate(latestDate);
		if (updateDate) {
			detailsText = t('currency.lastUpdate', { date: updateDate });
		}
	}
	return (
		<li className={`flex items-center font-light opacity-70 w-auto text-xs ${show ? '' : 'hidden'}`}>
			{detailsText}
			<button
				type='button'
				className='text-lg opacity-100 ml-2 bg-primary  rounded-md text-primary-content'
				onClick={action}
			>
				<MdRefresh />
			</button>
		</li>
	);
};

//Each parity item
const CurrencyDisplayItem = ({ from = 'USD', to = 'TRY', currency = 'USD', rateData = {} }) => {
	const { displayNumber } = useIntl();

	//Validation
	if (!rateData || 'rate' in rateData === false || isNaN(parseFloat(rateData.rate))) {
		return <></>;
	}

	//Up down?
	let isUp = null;
	let changeDetails = null;
	if (rateData.history && Array.isArray(rateData.history) && rateData.history.length > 0) {
		//a previous rate data exists!
		const previousRate = rateData.history[0];

		if (previousRate && 'rate' in previousRate && parseFloat(previousRate.rate) !== parseFloat(rateData.rate)) {
			if (rateData.rate > previousRate.rate) isUp = true;
			if (rateData.rate < previousRate.rate) isUp = false;

			const diff = parseFloat(rateData.rate) - parseFloat(previousRate.rate);
			const percent = Math.abs((diff / previousRate.rate) * 100);
			changeDetails = `${isUp ? '+' : '-'} ${displayNumber(percent, 2)}%`;
			//console.log(`Previous: ${previousRate.rate.toFixed(2)} Current: ${rateData.rate.toFixed(2)} change: ${percent}`);
		}
	}

	return (
		<Link to={`/currency/${currency}`}>
			<li className='flex items-center bg-base-300 text-base-content px-2 py-1 rounded-lg' title={changeDetails}>
				{/* Display symbols */}
				<span className='mr-1 font-light text-xs'>{`${from}/${to}`}</span>
				{/* Display Conversion Rate */}
				<span>{displayNumber(parseFloat(rateData.rate), 2)}</span>
				{/* Displa up/down icon */}
				{isUp === true && <FaCaretUp className='text-green-700 text-xs' />}
				{isUp === false && <FaCaretDown className='text-red-600 text-xs' />}
			</li>
		</Link>
	);
};
