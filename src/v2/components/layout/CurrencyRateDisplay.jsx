import React, { useState } from 'react';
import { MdRefresh } from 'react-icons/md';

import useIntl from '../../hooks/common/useIntl';
import { FaCaretUp, FaCaretDown, FaSpinner } from 'react-icons/fa';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CurrencyRateDisplay() {
	const [showDetails, setShowDetails] = useState(false);
	const { t } = useTranslation('translation');

	return (
		<div className=''>
			<ul className='list-none flex gap-x-2 font-normal justify-end flex-row-reverse md:flex-row'>
				<CurrencyDisplayItem
					
					currency='USD'
					from='$'
					to='€'
					rateData={null}
				/>
			</ul>
		</div>
	);
}


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
