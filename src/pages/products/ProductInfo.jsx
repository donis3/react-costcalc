import React from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveModal from '../../components/common/ResponsiveModal';
import ResponsiveModalError from '../../components/common/ResponsiveModalError';
import { useProductsContext } from '../../context/MainContext';
import useIntl from '../../hooks/common/useIntl';

export default function ProductInfo({ productId = null, handleClose = null }) {
	const { t } = useTranslation('pages/products', 'translation');
	const { products } = useProductsContext();
	const product = products.findById(productId);

	//Product Not Found
	if (!product) {
		return (
			<ResponsiveModalError handleClose={handleClose}>
				{/* Error  */}
				{t('info.notFound', { id: productId })}
			</ResponsiveModalError>
		);
	}

	//Product Found
	return (
		<ResponsiveModal
			title={t('info.title', { name: product.name })}
			handleClose={handleClose}
			showSubmit={false}
			autoFooter={true}
		>
			<div className='md:text-xl text-2xl grid grid-cols-12 gap-y-5 gap-x-10'>
				<InfoDetails product={product} />
			</div>
		</ResponsiveModal>
	);
}

//Product Details Component
const InfoDetails = ({ product = [] }) => {
	const { t } = useTranslation('pages/products');
	const { displayNumber, displayMoney } = useIntl();

	if (!product || typeof product !== 'object' || 'productId' in product === false) {
		return <div className='col-span-12 font-light'>{t('info.noData')}</div>;
	}
	//Rows array
	const rows = [];

	//Product Name
	rows.push({ left: t('info.name'), right: product.name });

	//code
	rows.push({ left: t('info.code'), right: product.code });

	//state
	rows.push({ left: t('info.state'), right: product.isLiquid ? t('states.liquid') : t('states.solid') });

	//Density
	if (product.isLiquid === true) {
		const densityText = `${displayNumber(product.density, 2)} g/cm<sup>3</sup>`;
		rows.push({ left: t('info.density'), right: densityText });
	}

	//Yearly Production
	let productionText = t('info.productionText', {
		value: displayNumber(product.production),
		unit: product.isLiquid ? 'L' : 'kg',
	});
	rows.push({ left: t('info.production'), right: productionText });

	//Yearly production mass
	if( product.isLiquid === true) {
		let txt = t('info.productionMassText', {value: displayNumber(product.productionMass)});
		rows.push({ left: t('info.productionMass'), right: txt });
	}

	// cost
	let costText = ` ${displayMoney(product.cost)} <small>/${product.isLiquid ? 'L' : 'kg'} </small>`;
	rows.push({ left: t('info.cost'), right: costText });

	//Display data here
	return <>{rows && rows.map((item, i) => <InfoDetailRow key={i} left={item.left} right={item.right} />)}</>;
};

//Single Row Component
const InfoDetailRow = ({ left = null, right = null, leaveGap = false }) => {
	const gapClass = leaveGap ? ' mt-5' : '';
	return (
		<>
			<span className={'font-bold col-span-4 w-fit h-auto  overflow-x-clip' + gapClass}>{left}</span>
			<span className={'col-span-8' + gapClass} dangerouslySetInnerHTML={{ __html: right }} />
		</>
	);
};
