import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NumericUnit from '../../../components/common/NumericUnit';
import PricePerUnit from '../../../components/common/PricePerUnit';
import CostTable from '../../../components/CostTable/CostTable';
import useEndProductCostAnalysis from '../../../hooks/endproducts/useEndProductCostAnalysis';
import ProductInfo from '../../products/ProductInfo';

export default function EndProductInfo({ data = null, recipeItems, packageItems } = {}) {
	const { t } = useTranslation('pages/endproducts');
	const [modalState, setModalState] = useState({ modal: 'product', isOpen: false });
	const openModal = (modal = 'product') => setModalState((state) => ({ ...state, modal, isOpen: true }));
	const closeModal = (modal = 'product') => setModalState((state) => ({ ...state, modal, isOpen: false }));

	const { costItems, costTotals } = useEndProductCostAnalysis({ recipeItems, packageItems, showTax: false });

	if (!data) return <></>;
	if (!data.package) return <>{t('error.packageError')}</>;
	if (!data.recipe) return <>{t('error.recipeError')}</>;

	const linkClass = 'border-b border-dotted border-base-content font-medium';
	return (
		<>
			{/* Product Details Section */}
			<div className='grid grid-cols-2 gap-x-2 gap-y-5'>
				{/* Grid Start */}
				{/* ... */}

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

				{/* Grid End */}
			</div>
			<div className='mt-10'>
				<h3 className='py-2 font-medium'>{t('endProduct.costTableTitle')}</h3>
				<CostTable items={costItems} costs={costTotals} />
			</div>

			{/* Modals */}
			{modalState.modal === 'product' && modalState.isOpen && (
				<ProductInfo productId={data.recipe.productId} handleClose={() => closeModal('product')} />
			)}
		</>
	);
}

function InfoItem({ title = null, children, ...attributes } = {}) {
	if (typeof children === 'string' && children.trim().length === 0) {
		return <></>;
	}
	return (
		<div {...attributes}>
			{/* Product Name */}
			<h4 className='text-base-content opacity-60 text-sm mb-1'>{title}</h4>
			<p className='text-base-content text-base font-medium'>{children}</p>
		</div>
	);
}
