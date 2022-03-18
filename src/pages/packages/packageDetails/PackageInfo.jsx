import React from 'react';
import { useTranslation } from 'react-i18next';
import CostTable from '../../../components/CostTable/CostTable';
import useIntl from '../../../hooks/common/useIntl';
import useStorageState from '../../../hooks/common/useStorageState';


export default function PackageInfo({ packageData } = {}) {
	const { t } = useTranslation('pages/packages', 'translation');
	const [displayState, setDisplayState] = useStorageState('displaySettings', {
		localPrice: true,
		baseUnit: false,
		showTax: false,
	});
	const { displayMoney } = useIntl();

	
	return (
		<>
			<div className='grid grid-cols-2 gap-x-2 gap-y-5'>
				{/* Grid Start */}
				{/* ... */}

				{/* Item */}
				<PackageInfoItem title={t('labels.name')}>
					{/* Package Bundle Name */}
					{packageData.name}
				</PackageInfoItem>

				<PackageInfoItem title={t('labels.productType')}>
					{/* Product Type */}
					{t(`physicalStates.${packageData.productType}`, { ns: 'translation' })}
				</PackageInfoItem>

				<PackageInfoItem title={<TaxToggle state={displayState} setState={setDisplayState} />}>
					{/* Cost per item with tax or without tax */}
					{displayMoney(displayState.showTax ? packageData.costWithTax : packageData.cost, packageData.currency)}
					<span className='text-xs ml-1 opacity-50'>{t('labels.costUnit')}</span>
				</PackageInfoItem>

				<PackageInfoItem title={t('labels.capacity')}>
					{/* Product Type */}
					{packageData.packageCapacity}
					<span className='ml-1'>
						{t(`units.${packageData.unit}`, { ns: 'translation', count: Math.round(packageData.packageCapacity) })}
					</span>
				</PackageInfoItem>

				<PackageInfoItem title={t('labels.notes')} className='col-span-2 whitespace-pre'>
					{packageData.notes}
				</PackageInfoItem>

				{/* ... */}
				{/* Grid End */}
			</div>
			<div className='mt-10'>
				<CostTable items={packageData.itemsForCostTable} costs={packageData.itemCostDetails} />
			</div>
		</>
	);
}

function PackageInfoItem({ title = null, children, ...attributes } = {}) {
	return (
		<div {...attributes}>
			{/* Product Name */}
			<h4 className='text-base-content opacity-60 text-sm mb-1'>{title}</h4>
			<p className='text-base-content text-base font-medium'>{children}</p>
		</div>
	);
}

function TaxToggle({ state, setState } = {}) {
	const { t } = useTranslation('translation');

	return (
		<span>
			{t('labels.cost')}
			<button
				type='button'
				className={`border bg-white rounded-md px-2 ml-1 text-xs ${state.showTax ? 'text-blue-900' : 'text-red-900'}`}
				onClick={() => setState((state) => ({ ...state, showTax: !state.showTax }))}
			>
				{/*  */}
				{state.showTax ? t('labels.withTax') : t('labels.noTax')}
			</button>
		</span>
	);
}
