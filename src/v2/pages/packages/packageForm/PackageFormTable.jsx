import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import useMoney from '../../../hooks/app/useMoney';
import useIntl from '../../../hooks/common/useIntl';
import AddPackageItem from './AddPackageItem';

export default function PackageFormTable({ items = null, onAdd = null, onRemove = null } = {}) {
	const { t } = useTranslation('pages/packages', 'translation');
	const { convert, displayMoney, defaultCurrency } = useMoney();

	const getTotal = () => {
		let defaultTotal = { total: 0, tax: 0, totalWithTax: 0, currency: defaultCurrency };
		if (!items || Array.isArray(items) === false) return defaultTotal;

		return items.reduce(
			(accumulator, current) => {
				if (isNaN(parseFloat(current.itemPrice)) || !current.itemCurrency) return accumulator;

				const { amount, currency } = convert(current.itemPrice, current.itemCurrency);
				if (!amount) return accumulator;

				const tax = current.itemTax > 0 ? amount * (current.itemTax / 100) : 0;
				return {
					total: accumulator.total + amount,
					tax: accumulator.tax + tax,
					totalWithTax: accumulator.totalWithTax + (amount + tax),
					currency,
				};
			},
			{ ...defaultTotal }
		);
	};

	const total = getTotal();

	return (
		<>
			<div className='w-full flex flex-col gap-y-0'>
				<div className='grid grid-cols-12 gap-x-2 font-medium leading-loose bg-base-300 rounded-t-md'>
					<div className='py-2 px-2 col-span-3'>{t('labels.item')}</div>
					<div className='py-2 px-2 col-span-3'>{t('labels.type')}</div>
					<div className='py-2 px-2 col-span-2'>{t('labels.itemTax')}</div>
					<div className='py-2 px-2 col-span-3'>{t('labels.itemPrice')}</div>
					<div className='py-2 px-2 col-span-1'></div>
				</div>
				{/* Items added to the table */}
				{items && items.length > 0 ? (
					items.map((item, index) => {
						return <PackageFormTableRow item={item} key={index} index={index} onRemove={onRemove} />;
					})
				) : (
					<p className='p-2 leading-relaxed opacity-70'>{t('form.itemTableNoContent')}</p>
				)}

				{items && items.length > 0 && (
					<div className='grid grid-cols-12 gap-x-2 gap-y-1  border-t-4 pt-3'>
						{total.total === total.totalWithTax ? (
							//Total and Total with Tax are the same. Show only one
							<>
								<div className='col-span-2 col-end-9 px-2  font-semibold'>
									{t('labels.total', { ns: 'translation' })}
								</div>
								<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.total, total.currency)}</div>
							</>
						) : (
							// Total and taxed total are different. show details
							<>
								<div className='col-span-3 col-end-9 px-2  font-semibold'>
									{t('labels.subTotal', { ns: 'translation' })}
								</div>
								<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.total, total.currency)}</div>
								<div className='col-span-3 col-end-9 px-2  font-semibold'>{t('labels.tax', { ns: 'translation' })}</div>
								<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.tax, total.currency)}</div>

								<div className='col-span-3 col-end-9 px-2  font-semibold'>
									{t('labels.total', { ns: 'translation' })}
								</div>
								<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.totalWithTax, total.currency)}</div>
							</>
						)}
					</div>
				)}
				{/* New Item form */}
				<AddPackageItem onAddItem={onAdd} />
			</div>
		</>
	);
}

function PackageFormTableRow({ item = null, index = 0, onRemove = null } = {}) {
	const { t } = useTranslation('translation');
	const { displayNumber, displayMoney } = useIntl();

	
	return (
		<div className={`grid grid-cols-12 gap-x-2 ${index % 2 === 0 ? '' : 'bg-base-200'}`}>
			<div className='py-2 px-2 col-span-3 truncate'>{item.name}</div>
			{/* Show box capacity if type is box */}
			<div className='py-2 px-2 col-span-3 text-sm'>
				{t('packageTypes.' + item.packageType)}
				{item.packageType === 'box' && item.boxCapacity && <span className='ml-1'>({item.boxCapacity})</span>}
			</div>
			<div className='py-2 px-2 col-span-2'>{displayNumber(item.itemTax, 2)}%</div>
			<div className='py-2 px-2 col-span-3'>{displayMoney(item.itemPrice, item.itemCurrency)}</div>
			<div className='py-2 px-2 col-span-1 flex justify-center items-center'>
				<Button.Remove
					hasText={false}
					className='bg-red-700 p-1 text-white rounded-md hover:bg-red-500'
					onClick={() => onRemove(index)}
				/>
			</div>
		</div>
	);
}
