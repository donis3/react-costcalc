import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';

export default function MaterialInfo({ materialId = null }) {
	//Load dependencies
	const { materials } = useContext(DataContext);
	const { t } = useTranslation('pages/materials');

	//Validate material id is int and load material data
	if (typeof materialId !== 'number') materialId = 0;
	const currentMaterial = materials.getMaterialById(materialId);
	if (!currentMaterial) {
		//Failed to load material
		return <p className='font-medium text-error-content'>{t('info.notFound', { id: materialId })}</p>;
	}

	const detailRows = generateDetailData(currentMaterial, t);

	//Show data
	return (
		<div className='md:text-xl text-3xl grid grid-cols-12 gap-y-5 gap-x-10'>
			{detailRows.map((item, index) => {
				return <React.Fragment key={index}>{item}</React.Fragment>;
			})}
		</div>
	);
}

const generateDetailData = (data = {}, t = null) => {
	if (!data || Object.keys(data).length === 0 || typeof t !== 'function') {
		return { detailKeys: [], detailValues: [] };
	}
	const rows = [];

	//Add each row

	//id
	if (data?.materialId !== null) {
		rows.push(<MaterialDetailRow left={t('details.materialId')} right={data.materialId} />);
	}
	//name
	if (data?.name !== null) {
		rows.push(<MaterialDetailRow left={t('details.name')} right={data.name} />);
	}
	//Price
	if (data?.price !== null) {
		rows.push(<MaterialDetailRow left={t('details.price')} right={data.getPrice?.()} />);
	}
    //Unit
	if (data?.unit !== null) {
		rows.push(<MaterialDetailRow left={t('details.unit')} right={data.getUnit?.()} />);
	}

	return rows;
};

//Display rows
const MaterialDetailRow = ({ left = null, right = null }) => {
	return (
		<>
			<span className='font-bold col-span-4 w-fit h-auto  overflow-x-clip'>{left}</span>
			<span className='col-span-8'>{right}</span>
		</>
	);
};
