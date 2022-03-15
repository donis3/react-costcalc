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
	const [displayState, setDisplayState] = useStorageState('displaySettings', { localPrice: true, baseUnit: false });

	const showLocalPrice = (value = true) => setDisplayState((state) => ({ ...state, localPrice: value }));
	const showBaseUnit = (value = true) => setDisplayState((state) => ({ ...state, baseUnit: value }));

	if (!material) {
		//Show data
		return (
			<ResponsiveModalError handleClose={handleClose}>{t('info.notFound', { id: materialId })}</ResponsiveModalError>
		);
	}

	const detailRows = generateDetailData(material, t, displayState.localPrice, displayState.baseUnit);

	const footer = (
		<div className='flex justify-between w-full items-start'>
			<button className='btn btn-primary' onClick={handleClose}>
				{t('buttons.close', { ns: 'translation' })}
			</button>
			<div>
				{/* Only show local currency checkbox if needed */}
				{material.isForeignCurrency === true && (
					<OptionControl state={displayState.localPrice} setState={showLocalPrice} text={t('showLocalPrice')} />
				)}
				{material.isBaseUnit === false && (
					<OptionControl state={displayState.baseUnit} setState={showBaseUnit} text={t('showBaseUnit')} />
				)}
			</div>
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

const generateDetailData = (data = {}, t = null, showLocalPrice = false, showBaseUnit = false) => {
	if (!data || Object.keys(data).length === 0 || typeof t !== 'function') {
		return { detailKeys: [], detailValues: [] };
	}
	//Remove local price if this is already local currency
	if (data.isForeignCurrency === false) showLocalPrice = false;
	if (data.isBaseUnit === true) showBaseUnit = false; //No need for unit conversion. Its already a basic unit

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
		//==================// Original Currency Original Unit Price //========================//
		if (showBaseUnit === false) {
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
		}
		//==================// ENDOF Original Currency Original Unit Price //========================//

		//==================// Original Currency Base Unit Price //========================//
		if (showBaseUnit === true) {
			//Base Price
			if (data?.baseUnitPrice !== null) {
				const priceContent = (
					<>
						{data.displayMoney(data.baseUnitPrice, data.currency)}
						<small className='ml-1 text-xs'>/{data.baseUnit}</small>
					</>
				);
				rows.push(<MaterialDetailRow left={t('details.price')} right={priceContent} />);
			}
			//Base Price w tax
			if (data?.baseUnitPriceWithTax !== null) {
				const priceContent = (
					<>
						{data.displayMoney(data.baseUnitPriceWithTax, data.currency)}
						<small className='ml-1 text-xs'>/{data.baseUnit}</small>
					</>
				);
				rows.push(<MaterialDetailRow left={t('details.priceWithTax')} right={priceContent} />);
			}
		}
		//==================// ENDOF Original Currency Base Unit Price //========================//
	} else {
		//==================// Converted Original Unit Price //========================//
		if (showBaseUnit === false) {
			//Local Price without tax
			if (data?.localPriceString !== null) {
				const localPriceContent = (
					<>
						{data.localPriceString}
						<small className='ml-1 text-xs'>/{data.unit}</small>
					</>
				);
				rows.push(<MaterialDetailRow left={t('details.price')} right={localPriceContent} />);
			}
			//priceWithTax
			if (data?.localPriceWithTaxString !== null) {
				const localPriceContent = (
					<>
						{data.localPriceWithTaxString}
						<small className='ml-1 text-xs'>/{data.unit}</small>
					</>
				);
				rows.push(<MaterialDetailRow left={t('details.priceWithTax')} right={localPriceContent} />);
			}
		}
		//==================// ENDOFConverted Original Unit Price //========================//

		//==================// Converted Base Unit Price //========================//
		if (showBaseUnit === true) {
			//Local base unit Price without tax
			if (data?.localBaseUnitPrice !== null) {
				const localPriceContent = (
					<>
						{data.displayMoney(data.localBaseUnitPrice)}
						<small className='ml-1 text-xs'>/{data.unit}</small>
					</>
				);
				rows.push(<MaterialDetailRow left={t('details.price')} right={localPriceContent} />);
			}
			//base unit local priceWithTax
			if (data?.localBaseUnitPriceWithTax !== null) {
				const localPriceContent = (
					<>
						{data.displayMoney(data.localBaseUnitPriceWithTax)}
						<small className='ml-1 text-xs'>/{data.unit}</small>
					</>
				);
				rows.push(<MaterialDetailRow left={t('details.priceWithTax')} right={localPriceContent} />);
			}
		}
		//==================// ENDOF Converted Base Unit Price //========================//
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
