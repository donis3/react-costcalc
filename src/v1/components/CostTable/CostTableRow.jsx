import React from 'react';
import { useTranslation } from 'react-i18next';
import useIntl from '../../hooks/common/useIntl';

export default function CostTableRow({ index, data, itemCallback = null } = {}) {
	const { displayNumber, displayMoney } = useIntl();
	const stripeClass = index % 2 === 0 ? '  ' : ' bg-base-200 ';
	const additionalClass = ' p-3';
	const { t } = useTranslation('translation');

	//Extract row data
	if (!data) return <></>;
	const { name = '', price = 0, tax = 0, quantity = 0, unit = 'kg', amount = 0, currency = '' } = data;

	//Clickable button if callback provided
	const itemName =
		typeof itemCallback === 'function' ? (
			<button type='button' onClick={itemCallback} className='font-semibold border-b border-dotted border-base-content'>
				{name}
			</button>
		) : (
			<>{name}</>
		);
	const quantityDecimalPlaces = unit === 'pcs' ? 0 : 2;
	return (
		<>
			<div className={'col-span-4 ' + stripeClass + additionalClass}>{itemName}</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>{displayMoney(price, currency)}</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>% {displayNumber(tax, 1)}</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>
				{displayNumber(quantity, quantityDecimalPlaces)}{' '}
				{unit && t(`unitsShort.${unit}`, { count: Math.round(quantity) })}
			</div>
			<div className={'col-span-2 ' + stripeClass + additionalClass}>{displayMoney(amount)}</div>
		</>
	);
}
