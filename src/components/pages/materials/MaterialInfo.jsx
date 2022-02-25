import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';

export default function MaterialInfo({ materialId = null }) {
	//Load dependencies
	const { materials } = useContext(DataContext);
	const { t } = useTranslation('pages/materials');

	//Validate material id is int and load material data
	if (typeof materialId !== 'number') materialId = 0;
	const currentMaterial = materials.getMaterial(materialId);
	if (!currentMaterial) {
		//Failed to load material
		return <p className='font-semibold text-error-content'>{t('info.notFound', { id: materialId })}</p>;
	}
    
    //Show data
	return <div>MaterialInfo</div>;
}
