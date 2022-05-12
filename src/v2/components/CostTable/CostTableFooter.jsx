import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useIntl from '../../hooks/common/useIntl';
import { FaCaretRight, FaCaretDown } from 'react-icons/fa';

/* Sample Costs Object
{
  "total": 71.32,
  "totalWithTax": 83.15759999999999,
  "totalTax": 11.8376,
  "tax": [
    {
      "percent": 8,
      "amount": 0.8
    },
    {
      "percent": 18,
      "amount": 11.0376
    }
  ]
}
*/
//Collapsible item totals
export default function CostTableFooter({ costs = null } = {}) {
	const { t } = useTranslation('translation');
	const { displayMoney } = useIntl();
	const [showDetails, setShowDetails] = useState(false);
	const toggleDetails = () => {
		setShowDetails((state) => !state);
	};
	if (!costs || typeof costs !== 'object' || 'total' in costs === false) return <></>;

	return (
		<div className='grid grid-cols-12  leading-snug border-t-4 pt-2 gap-y-1'>
			{/* Row 1 */}
			{/* Show Details Button & Total without tax*/}
			<div className='col-span-10 px-3 flex justify-end'>
				<button onClick={toggleDetails} className='flex gap-x-1 items-center'>
					{showDetails ? <FaCaretDown className='text-blue-600' /> : <FaCaretRight className='text-blue-600' />}
					<span className='border-b border-neutral border-dotted'>{t('costTable.total')}</span>
				</button>
			</div>
			<div className='col-span-2 px-3  text-left font-medium'>{displayMoney(costs.total)}</div>
			{/* Show Details Button */}

			{/* Other Rows */}
			{showDetails && <CostTotalOpened costs={costs} toggle={toggleDetails} />}
		</div>
	);
}

//Cost details
function CostTotalOpened({ costs = null } = {}) {
	const { t } = useTranslation('translation');
	if (!costs || typeof costs !== 'object' || 'total' in costs === false) return <></>;

	return (
		<>
			{/* show tax rows */}
			{Array.isArray(costs.tax) &&
				costs.tax.map((item, i) => {
					return (
						<CostRow
							key={i}
							text={t('costTable.taxPercent', { percent: item.percent })}
							currency={costs.currency}
							amount={item.amount}
						/>
					);
				})}
			{/* Show Total Tax */}

			<CostRow text={t('costTable.taxTotal')} currency={costs.currency} amount={costs.totalTax} />
			<CostRow text={t('costTable.totalWitTax')} currency={costs.currency} amount={costs.totalWithTax} />
		</>
	);
}

//Each cost detail row
function CostRow({ text, amount, currency } = {}) {
	const { displayMoney } = useIntl();
	return (
		<>
			<div className='col-span-10 px-3 text-right '>{text}</div>
			<div className='col-span-2 px-3  text-left font-medium'>{displayMoney(amount, currency)}</div>
		</>
	);
}
