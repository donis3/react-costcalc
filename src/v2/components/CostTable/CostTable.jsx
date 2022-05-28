import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CostTableFooter from './CostTableFooter';
import CostTableRow from './CostTableRow';

//item needs to have id property for callbacks to work
export default function CostTable({ items = null, costs = null, itemCallback = null } = {}) {
	const { t } = useTranslation('translation');
	
	//Generate a callback function if id is defined in each item.
	function getCallback(id = null) {
		if (id === null || id === undefined) return null;
		if (typeof itemCallback !== 'function') return null;
		return () => itemCallback(id);
	}

	if (!items || !Array.isArray(items) || items.length === 0) {
		return <p className='mt-1 text-sm italic opacity-50'>{t('costTable.noContent')}</p>;
	}

	return (
		<div className='w-full'>
			<div className='grid grid-cols-12 font-semibold uppercase bg-base-300 text-base-content rounded-t-md'>
				<div className='col-span-4 p-3'>{t('costTable.item')}</div>
				<div className='col-span-2 p-3'>{t('costTable.unitPrice')}</div>
				<div className='col-span-2 p-3'>{t('costTable.tax')}</div>
				<div className='col-span-2 p-3'>{t('costTable.quantity')}</div>
				<div className='col-span-2 p-3'>{t('costTable.amount')}</div>
			</div>
			<div className='grid grid-cols-12  leading-snug w-full'>
				{items.map((data, i) => (
					<CostTableRow index={i} data={data} key={i} itemCallback={getCallback(data?.id)} />
				))}
			</div>
			<CostTableFooter costs={costs} />
		</div>
	);
}

/*
Example Costs:
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

Example Items:
[
  {
    "unit": "pcs",
    "name": "Nice Item",
    "price": 4.2,
    "tax": 18,
    "quantity": 1,
    "currency": "USD",
    "amount": 61.32
  },
  {
    "unit": "pcs",
    "name": "Cute Item",
    "price": 10,
    "tax": 8,
    "quantity": 1,
    "currency": "TRY",
    "amount": 10
  }
]
*/
