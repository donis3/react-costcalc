import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaMoneyBillAlt } from 'react-icons/fa';
import NumericUnit from '../../../components/common/NumericUnit';
import useIntl from '../../../hooks/common/useIntl';

export default function ProductPriceWidget({ cost, costWithTax, unit, currency }) {
	const { t } = useTranslation('pages/endproducts');
	const { displayMoney } = useIntl();

	return (
		<div className='stat  w-full md:w-auto md:max-w-sm gap-x-10 p-3 border rounded-md shadow-sm'>
			{/* Stat Icon or Array of Icons */}
			<div className='stat-figure text-4xl flex'>
				<FaMoneyBillAlt />
			</div>

			{/* Stat Title */}
			<div className='stat-title text-base  flex items-center gap-x-1'>
				{/* Widget Title */}
				{t('endProduct.currentCost')}
			</div>
			{/* Stat Value */}
			<div className='stat-value text-2xl'>
				<NumericUnit isPer type={unit}>
					{displayMoney(cost, currency)}
				</NumericUnit>
			</div>
			{/* Stat Description */}
			{costWithTax !== cost && (
				<div className='stat-desc text-xs'>
					{t('labels.priceWithTax', { ns: 'translation', price: displayMoney(costWithTax, currency) })}
				</div>
			)}
		</div>
	);
}

ProductPriceWidget.defaultProps = {
	cost: 0,
	costWithTax: 1,
	unit: 'pcs',
	currency: 'USD',
};
