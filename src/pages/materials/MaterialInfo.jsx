import React from 'react';
import { useTranslation } from 'react-i18next';
import OptionControl from '../../components/common/OptionControl';
import ResponsiveModal from '../../components/common/ResponsiveModal';
import ResponsiveModalError from '../../components/common/ResponsiveModalError';
import { useMaterialContext } from '../../context/MainContext';
import useStorageState from '../../hooks/common/useStorageState';

export default function MaterialInfo({ handleClose = null, materialId = null }) {
	//Load dependencies
	const { Materials } = useMaterialContext();
	const { t } = useTranslation('pages/materials');
	const material = Materials.findById(materialId, true);
	const [showLocalPrice, setShowLocalPrice] = useStorageState('showLocalPrice', false);

	if (!material) {
		//Show data
		return (
			<ResponsiveModalError handleClose={handleClose}>{t('info.notFound', { id: materialId })}</ResponsiveModalError>
		);
	}

	const detailRows = generateDetailData(material, t, showLocalPrice);

	const footer = (
		<div className='flex justify-between w-full items-center'>
			<button className='btn btn-primary' onClick={handleClose}>
				{t('buttons.close', { ns: 'translation' })}
			</button>
			{/* Only show local currency checkbox if needed */}
			{material.isForeignCurrency === true ? (
				<OptionControl state={showLocalPrice} setState={setShowLocalPrice} text={t('showLocalPrice')} />
			) : (
				''
			)}
		</div>
	);

	//Show data
	return (
		<ResponsiveModal title={t('info.title', { name: material.name })} handleClose={handleClose} footer={footer}>
			<div className='md:text-xl text-2xl grid grid-cols-12 gap-y-5 gap-x-10'>
				{detailRows.map((item, index) => {
					return <React.Fragment key={index}>{item}</React.Fragment>;
				})}
			</div>
		</ResponsiveModal>
	);
}

const generateDetailData = (data = {}, t = null, showLocalPrice = false) => {
	if (!data || Object.keys(data).length === 0 || typeof t !== 'function') {
		return { detailKeys: [], detailValues: [] };
	}
	//Remove local price if this is already local currency
	if (data.isForeignCurrency === false) showLocalPrice = false;

	const rows = [];

	//Add each row
	//name
	if (data?.name !== null) {
		rows.push(<MaterialDetailRow left={t('details.name')} right={data.name} />);
	}

	//id
	if (data?.materialId !== null) {
		rows.push(<MaterialDetailRow left={t('details.materialId')} right={data.materialId} />);
	}

	//Unit
	if (data?.unit !== null) {
		rows.push(<MaterialDetailRow left={t('details.unit')} right={data.fullUnit} />);
	}
	//density
	if (data?.density !== null) {
		rows.push(<MaterialDetailRow left={t('details.density')} right={data.fullDensity} />);
	}
	//Tax
	if (data?.tax !== null) {
		rows.push(<MaterialDetailRow left={t('details.tax')} right={data.fullTax} />);
	}

	//if showLocalPrice id disabled
	if (!showLocalPrice) {
		//Add original currency prices

		//Price
		if (data?.price !== null) {
			const priceContent = (
				<>
					{data.fullPrice}
					<small className='ml-1 text-xs'>/{data.unit}</small>
				</>
			);
			rows.push(<MaterialDetailRow left={t('details.price')} right={priceContent} />);
		}
		//Taxed Price
		if (data?.price !== null) {
			const priceContent = (
				<>
					{data.priceWithTax}
					<small className='ml-1 text-xs'>/{data.unit}</small>
				</>
			);
			rows.push(<MaterialDetailRow left={t('details.priceWithTax')} right={priceContent} />);
		}
	} else {
		//Local Price without tax
		if (data?.isForeignCurrency) {
			const localPriceContent = (
				<>
					{data.localPriceString}
					<small className='ml-1 text-xs'>/{data.unit}</small>
				</>
			);
			rows.push(<MaterialDetailRow left={t('details.price')} right={localPriceContent} />);
		}
		//priceWithTax
		if (data?.price !== null) {
			const localPriceContent = (
				<>
					{data.localPriceWithTaxString}
					<small className='ml-1 text-xs'>/{data.unit}</small>
				</>
			);
			rows.push(<MaterialDetailRow left={t('details.priceWithTax')} right={localPriceContent} />);
		}
	}

	return rows;
};

//Display rows
const MaterialDetailRow = ({ left = null, right = null }) => {
	if (typeof right === 'string') {
		return (
			<>
				<span className={'font-bold col-span-4 w-fit h-auto  overflow-x-clip'}>{left}</span>
				<span className={'col-span-8'} dangerouslySetInnerHTML={{ __html: right }} />
			</>
		);
	} else {
		return (
			<>
				<span className={'font-bold col-span-4 w-fit h-auto  overflow-x-clip'}>{left}</span>
				<span className={'col-span-8'}>{right} </span>
			</>
		);
	}
};
