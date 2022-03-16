import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/common/Button';
import useCurrencyConversion from '../../../hooks/app/useCurrencyConversion';
import useIntl from '../../../hooks/common/useIntl';
import AddPackageItem from './AddPackageItem';
const mockItems = [
	{
		name: '1L Şişe',
		type: 'container',
		price: 1.2,
		tax: 0,
		currency: 'USD',
	},
	{
		name: '1L Koli 30x20',
		type: 'box',
		price: 1.2,
		tax: 5,
		currency: 'USD',
		boxCapacity: 20,
	},
];

export default function PackageFormTable({ items = mockItems } = {}) {
	const { t } = useTranslation('pages/packages', 'translation');
	const { convert, displayMoney, defaultCurrency } = useCurrencyConversion();

	const getTotal = () => {
		let defaultTotal = { total: 0, tax: 0, totalWithTax: 0, currency: defaultCurrency };
		if (!items || Array.isArray(items) === false) return defaultTotal;
		return items.reduce(
			(accumulator, current) => {
				if (isNaN(parseFloat(current.price)) || !current.currency) return accumulator;

				const { amount, currency } = convert(current.price, current.currency);
				if (!amount) return accumulator;

				const tax = current.tax > 0 ? amount * (current.tax / 100) : 0;
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
				{items &&
					items.map((item, index) => {
						return <PackageFormTableRow item={item} key={index} index={index} />;
					})}
				{!items && <p className='p-2 leading-relaxed opacity-70'>{t('form.itemTableNoContent')}</p>}

				<div className='grid grid-cols-12 gap-x-2 gap-y-1  border-t-4 pt-3'>
					<div className='col-span-2 col-end-9 px-2  font-semibold'>{t('labels.subTotal', { ns: 'translation' })}</div>
					<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.total, total.currency)}</div>
					{total.total !== total.totalWithTax && (
						<>
							<div className='col-span-2 col-end-9 px-2  font-semibold'>{t('labels.tax', { ns: 'translation' })}</div>
							<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.tax, total.currency)}</div>

							<div className='col-span-2 col-end-9 px-2  font-semibold'>{t('labels.total', { ns: 'translation' })}</div>
							<div className='col-span-4 col-end-13 px-2'>{displayMoney(total.totalWithTax, total.currency)}</div>
						</>
					)}
				</div>
				{/* New Item form */}
				<AddPackageItem />
			</div>
		</>
	);
}

function PackageFormTableRow({ item = null, index = 0 } = {}) {
	const { t } = useTranslation('translation');
	const { displayNumber, displayMoney } = useIntl();
	return (
		<div className={`grid grid-cols-12 gap-x-2 ${index % 2 === 0 ? '' : 'bg-base-200'}`}>
			<div className='py-2 px-2 col-span-3 truncate'>{item.name}</div>
			{/* Show box capacity if type is box */}
			<div className='py-2 px-2 col-span-3 text-sm'>
				{t('packageTypes.' + item.type)}
				{item.type === 'box' && item.boxCapacity && <span className='ml-1'>({item.boxCapacity})</span>}
			</div>
			<div className='py-2 px-2 col-span-2'>{displayNumber(item.tax, 2)}%</div>
			<div className='py-2 px-2 col-span-3'>{displayMoney(item.price, item.currency)}</div>
			<div className='py-2 px-2 col-span-1 flex justify-center items-center'>
				<Button.Remove hasText={false} className='bg-red-700 p-1 text-white rounded-md hover:bg-red-500' />
			</div>
		</div>
	);
}
