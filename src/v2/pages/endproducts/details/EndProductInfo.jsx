import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DropdownMenu from '../../../components/common/DropdownMenu';
import NumericUnit from '../../../components/common/NumericUnit';
import PricePerUnit from '../../../components/common/PricePerUnit';
import CostTable from '../../../components/CostTable/CostTable';
import useEndProductCostAnalysis from '../../../context/endproducts/useEndProductCostAnalysis';

import useMoney from '../../../hooks/app/useMoney';

import ProductInfo from '../../products/ProductInfo';
import ProductPriceWidget from './ProductPriceWidget';

export default function EndProductInfo({ data = null, recipeItems, packageItems, labourItems, overheadItems } = {}) {
	const { defaultCurrency } = useMoney();
	const { t } = useTranslation('pages/endproducts');
	const [modalState, setModalState] = useState({ modal: 'product', isOpen: false });
	const openModal = (modal = 'product') => setModalState((state) => ({ ...state, modal, isOpen: true }));
	const closeModal = (modal = 'product') => setModalState((state) => ({ ...state, modal, isOpen: false }));

	const { costItems, costTotals, toggles, toggleCost } = useEndProductCostAnalysis({
		recipeItems,
		packageItems,
		showTax: false,
		labourItems,
		overheadItems,
	});

	

	if (!data) return <></>;
	if (!data.package) return <>{t('error.packageError')}</>;
	if (!data.recipe) return <>{t('error.recipeError')}</>;

	const linkClass = 'border-b border-dotted border-base-content font-medium';
	return (
		<>
			{/* Product Details Section */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5 p-3 md:p-1'>
				{/* Grid Start */}
				{/* Price Row */}
				<div className='w-full col-span-full flex'>
					<ProductPriceWidget
						cost={data.totalCost}
						costWithTax={data.totalCostWithTax}
						currency={defaultCurrency}
						unit='pcs'
					/>
				</div>

				{/* Item */}
				<InfoItem title={t('labels.name', { ns: 'translation' })}>
					{/* Package Bundle Name */}
					{data.name}
				</InfoItem>

				{/* Product Type */}
				<InfoItem title={t('labels.physicalState', { ns: 'translation' })}>
					{/* Product Type */}
					{t(`physicalStates.${data.recipe.isLiquid ? 'liquid' : 'solid'}`, { ns: 'translation' })}
				</InfoItem>

				{/* Product Name */}
				<InfoItem title={t('labels.product', { ns: 'translation' })}>
					{/* Product Name */}
					<button type='button' onClick={() => openModal('product')} className={linkClass}>
						{data.recipe.product}
					</button>
				</InfoItem>

				{/* Product Name */}
				<InfoItem title={t('labels.recipe', { ns: 'translation' })}>
					{/* Product Name */}
					<Link to={'/recipes/' + data.recipeId} className={linkClass}>
						{data.recipe.name}
					</Link>
				</InfoItem>

				{/* Package Name */}
				<InfoItem title={t('labels.package', { ns: 'translation' })}>
					{/* Product Name */}
					<Link to={'/packages/' + data.packageId} className={linkClass}>
						{data.package.name}
					</Link>
				</InfoItem>

				{/* Package Capacity */}
				<InfoItem title={t('labels.packageCapacity', { ns: 'translation' })}>
					{/* Product Name */}
					<NumericUnit type={data.package.unit}>{data.package.packageCapacity}</NumericUnit>
				</InfoItem>

				{data.recipe.isLiquid === true && (
					<>
						{/* Product Density */}
						<InfoItem title={t('labels.density', { ns: 'translation' })}>
							{/* use standard numeric unit display */}
							<NumericUnit type='density'>{data.recipe.density}</NumericUnit>
						</InfoItem>
						{/* Product Weight */}
						<InfoItem title={t('labels.weight', { ns: 'translation' })}>
							{/* use standard numeric unit display */}
							<NumericUnit type='weight'>{data.getWeight()}</NumericUnit>
						</InfoItem>
					</>
				)}

				{/* Product Cost per Unit */}
				<InfoItem title={t('endProduct.cost')}>
					{/* Product Cost without tax */}
					<PricePerUnit unit={'pcs'}>{data.totalCost}</PricePerUnit>
				</InfoItem>
				{/* Product Cost per Unit */}
				<InfoItem title={t('endProduct.costWithTax')}>
					{/* Product Cost without tax */}
					<PricePerUnit unit={'pcs'}>{data.totalCostWithTax}</PricePerUnit>
				</InfoItem>

				{/* Item */}
				<InfoItem title={t('labels.commercialName')}>
					{/* Package Bundle Name */}
					{data.commercialName}
				</InfoItem>
				{/* Notes */}
				<InfoItem title={t('labels.notes', { ns: 'translation' })} row pre>
					{/* Package Bundle Name */}
					{data.notes}
				</InfoItem>

				{/* Grid End */}
			</div>
			<div className='mt-10'>
				<div className='p-2 flex gap-1 items-center'>
					<h3 className='font-medium whitespace-nowrap'>{t('endProduct.costTableTitle')}</h3>
					<DropdownMenu icon={<FaCog />} align='auto' className='flex-1'>
						{Object.keys(toggles).map((costType, i) => {
							const isActive = toggles[costType] === true;
							return (
								<DropdownMenu.Element key={'costType-' + i}>
									<button
										className={`btn btn-sm normal-case w-full justify-start btn-ghost gap-2 whitespace-nowrap ${
											!isActive && 'font-normal pl-8'
										}`}
										type='button'
										onClick={() => toggleCost(costType)}
									>
										{isActive && <FaCheck />}
										{t(`toggles.${costType}`)}
									</button>
								</DropdownMenu.Element>
							);
						})}
					</DropdownMenu>
				</div>
				<CostTable items={costItems} costs={costTotals} />
			</div>

			{/* Modals */}
			{modalState.modal === 'product' && modalState.isOpen && (
				<ProductInfo productId={data.recipe.productId} handleClose={() => closeModal('product')} />
			)}
		</>
	);
}

function InfoItem({ title = null, children, row = false, pre = false, ...attributes } = {}) {
	if (typeof children === 'string' && children.trim().length === 0) {
		return <></>;
	}
	return (
		<div {...attributes} className={row ? 'col-span-full' : ''}>
			{/* Product Name */}
			<h4 className='text-base-content opacity-60 text-sm mb-1'>{title}</h4>
			<p className={`text-base-content text-base font-medium ${pre && 'whitespace-pre'}`}>{children}</p>
		</div>
	);
}
