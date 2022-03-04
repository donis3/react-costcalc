import React from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveModal from '../../components/common/ResponsiveModal';
import ResponsiveModalError from '../../components/common/ResponsiveModalError';
import { useMaterialContext } from '../../context/MainContext';

export default function MaterialInfo({ handleClose = null, materialId = null }) {
	//Load dependencies
	const { Materials } = useMaterialContext();
	const { t } = useTranslation('pages/materials');
	const material = Materials.findById(materialId, true);

	if (!material) {
		//Show data
		return (
			<ResponsiveModalError handleClose={handleClose}>{t('info.notFound', { id: materialId })}</ResponsiveModalError>
		);
	}

	const detailRows = generateDetailData(material, t);

	//Show data
	return (
		<ResponsiveModal
			title={t('info.title', { name: material.name })}
			handleClose={handleClose}
			showSubmit={false}
			autoFooter={true}
		>
			<div className='md:text-xl text-2xl grid grid-cols-12 gap-y-5 gap-x-10'>
				{detailRows.map((item, index) => {
					return <React.Fragment key={index}>{item}</React.Fragment>;
				})}
			</div>
		</ResponsiveModal>
	);
}

const generateDetailData = (data = {}, t = null) => {
	if (!data || Object.keys(data).length === 0 || typeof t !== 'function') {
		return { detailKeys: [], detailValues: [] };
	}
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

	//Price
	if (data?.price !== null) {
		rows.push(<MaterialDetailRow left={t('details.price')} right={data.fullPrice} leaveGap={true} />);
	}
	//Tax
	if (data?.tax !== null) {
		rows.push(<MaterialDetailRow left={t('details.tax')} right={data.fullTax} />);
	}
	//priceWithTax
	if (data?.price !== null) {
		rows.push(<MaterialDetailRow left={t('details.priceWithTax')} right={data.priceWithTax} />);
	}

	return rows;
};

//Display rows
const MaterialDetailRow = ({ left = null, right = null, leaveGap = false }) => {
	const gapClass = leaveGap ? ' mt-5' : '';
	return (
		<>
			<span className={'font-bold col-span-4 w-fit h-auto  overflow-x-clip' + gapClass}>{left}</span>
			<span className={'col-span-8' + gapClass} dangerouslySetInnerHTML={{ __html: right }} />
		</>
	);
};
