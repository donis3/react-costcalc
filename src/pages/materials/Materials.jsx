import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMaterials from '../../hooks/materials/useMaterials';
import useSortTableByField from '../../hooks/app/useSortTableByField';

import Card from '../../components/common/Card';
import MaterialTable from './MaterialTable';
import MaterialForm from './MaterialForm';

export default function Materials() {
	//Translation
	const { t } = useTranslation('pages/materials');
	//Modal States
	const [isAddMaterialOpen, setAddMaterialOpen] = useState(false);
	const [editMaterialModal, setEditMaterialModal] = useState({ isOpen: false, materialId: null });
	const openEditMaterial = (materialId = null) => {
		if (materialId !== null && isNaN(parseInt(materialId)) === false) {
			setEditMaterialModal({ isOpen: true, materialId: parseInt(materialId) });
		}
	};
	const closeEditMaterial = () => {
		setEditMaterialModal({ isOpen: false, materialId: null });
	};
	//Materials Hook
	const { Materials, dispatch } = useMaterials();

	//Table Sorting Helper Hook
	const [sortingState, sortBy] = useSortTableByField('materials', Materials.fields, Materials.fields[0]);

	//console.log(Materials.getAll({ field: sortingState.field, asc: sortingState.asc }));

	//Modal Elements
	const editModal = editMaterialModal.isOpen ? (
		<MaterialForm
			materials={Materials}
			dispatch={dispatch}
			handleClose={closeEditMaterial}
			materialId={editMaterialModal.materialId}
		/>
	) : (
		<></>
	);

	const addModal = isAddMaterialOpen ? (
		<MaterialForm materials={Materials} dispatch={dispatch} handleClose={() => setAddMaterialOpen(false)} />
	) : (
		<></>
	);

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<div className='w-full flex justify-end'>
					<button className='btn btn-primary btn-sm' onClick={() => setAddMaterialOpen(true)}>
						{'+' + t('btnNew')}
					</button>
				</div>
				<h3 className='text-2xl py-2 font-semibold'>{t('title')}</h3>
				<p className='opacity-80'>{t('lead')}</p>

				<MaterialTable
					materials={Materials.getAll({ field: sortingState.field, asc: sortingState.asc })}
					sortingState={sortingState}
					sortBy={sortBy}
					showEdit={openEditMaterial}
				/>
			</Card>
			{isAddMaterialOpen && addModal}
			{editMaterialModal.isOpen && editModal}
		</>
	);
}
