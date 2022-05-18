import React, { useEffect, useState } from 'react';
import { RiMenuFill as MenuIcon, RiRefreshLine as RefreshIcon, RiSettings3Line as SettingsIcon } from 'react-icons/ri';

import useIntl from '../../hooks/common/useIntl';
import { FaCaretUp, FaCaretDown, FaSpinner } from 'react-icons/fa';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useCurrency from '../../context/currency/useCurrency';
import ReactTooltip from 'react-tooltip';
import DropdownMenu from '../common/DropdownMenu';
import useExchangeRates from '../../hooks/exrates/useExchangeRates';

export default function CurrencyRateDisplay() {
	const { t } = useTranslation('translation');
	const { currencies, getRate } = useCurrency();
	const favorites = currencies?.favorites || []; //Show only favorites
	const { fetchExchangeRates, loading, isDisabled, provider } = useExchangeRates();

	useEffect(() => {
		ReactTooltip.rebuild();
	}, []);

	if (!Array.isArray(favorites) || favorites.length === 0) return <></>;
	return (
		<div className='flex gap-1 relative'>
			<ReactTooltip id='currency-tooltip' />
			<ul className='list-none flex flex-wrap gap-2 font-normal justify-end flex-row-reverse md:flex-row items-center'>
				<CurrencyDisplayItem currency='USD' from='$' to='€' rateData={null} />
				{favorites.map((currencyCode) => (
					<CurrencyDisplayItem
						key={currencyCode}
						from={currencyCode}
						to={currencies.default}
						data={getRate(currencyCode)}
					/>
				))}
			</ul>

			<DropdownMenu icon={<MenuIcon />}>
				{isDisabled === false && (
					<DropdownMenu.Item callback={loading ? null : fetchExchangeRates}>
						<div className={`flex flex-col gap-1 justify-end items-end ${loading && 'opacity-50'}`}>
							<span>{t('currency.refresh')}</span>
							<span className='font-light text-xs'>{provider.name}</span>
						</div>
						<RefreshIcon className={loading ? 'animate-spin' : ''} />
					</DropdownMenu.Item>
				)}

				{/* Settings Link */}
				<DropdownMenu.Link to='/settings'>
					{t('currency.settings')}
					<SettingsIcon />
				</DropdownMenu.Link>
			</DropdownMenu>
		</div>
	);
}

//Each parity item
const CurrencyDisplayItem = ({ from, to, data }) => {
	const { displayNumber } = useIntl();
	if (!from || !to || !data || 'rate' in data === false || isNaN(parseFloat(data.rate))) return <></>;

	//Up down?
	let isUp = null;
	let changeDetails = null;

	if ('change' in data && isNaN(parseFloat(data.change)) === false) {
		const percent = data.change;
		if (percent < 0) {
			changeDetails = `- ${displayNumber(Math.abs(percent))}%`;
			isUp = false;
		} else if (percent > 0) {
			changeDetails = `+ ${displayNumber(Math.abs(percent))}%`;
			isUp = true;
		} else {
			changeDetails = null;
			isUp = null;
		}
	}

	return (
		<Link to={`/currency/${from}`}>
			<li
				className='flex items-center bg-base-300 text-base-content px-2 py-1 rounded-lg text-sm'
				data-tip={changeDetails}
				data-for='currency-tooltip'
			>
				{/* Display symbols */}
				<span className='mr-1 font-light text-xs'>{`${from}/${to}`}</span>
				{/* Display Conversion Rate */}
				<span>{displayNumber(parseFloat(data.rate), 2)}</span>
				{/* Displa up/down icon */}
				{isUp === true && <FaCaretUp className='text-green-700 text-xs' />}
				{isUp === false && <FaCaretDown className='text-red-600 text-xs' />}
			</li>
		</Link>
	);
};

CurrencyDisplayItem.defaultProps = {
	from: null,
	to: null,
	data: null,
};
