import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../components/common/Card';
import MaterialTable from './MaterialTable';
import MaterialForm from './MaterialForm';
import MaterialInfo from './MaterialInfo';
import Button from '../../components/common/Button';

export default function Materials() {
	//Translation
	const { t } = useTranslation('pages/materials');
	//Modal open/closed states
	const [modalState, setModalState] = useState({ isOpen: false, type: 'info', materialId: null });

	const openModal = (type = '', materialId = null) => {
		if (['add', 'edit', 'info'].includes(type) === false) return;
		if (['edit', 'info'].includes(type)) {
			materialId = parseInt(materialId);
			if (isNaN(materialId)) return;
		}

		setModalState({ isOpen: true, type: type, materialId: materialId });
	};
	const closeModal = () => {
		setModalState({ isOpen: false, type: 'add', materialId: null });
	};

	//JSX
	return (
		<>
			<Card className='w-full px-3 py-5' shadow='shadow-lg'>
				{/* New Item Button */}
				<div className='w-full flex justify-between items-center'>
					{/* Title & Lead Text */}
					<h3 className='text-2xl py-2 font-semibold'>{t('title')}</h3>
					<Button.Add type='button' onClick={() => openModal('add')} />
				</div>
				<p className='opacity-80'>{t('lead')}</p>

				<MaterialTable openModal={openModal} />
			</Card>
			{/* Modals */}
			{modalState.isOpen && modalState.type === 'add' && <MaterialForm handleClose={closeModal} />}
			{modalState.isOpen && modalState.type === 'edit' && (
				<MaterialForm handleClose={closeModal} materialId={modalState.materialId} />
			)}
			{modalState.isOpen && modalState.type === 'info' && (
				<MaterialInfo handleClose={closeModal} materialId={modalState.materialId} />
			)}
		</>
	);
}
