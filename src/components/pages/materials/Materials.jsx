import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../common/Card';
import ResponsiveModal from '../../common/ResponsiveModal';
import MaterialForm from './MaterialForm';
import MaterialTable from './MaterialTable';

export default function Materials() {
	const { t } = useTranslation('pages/materials');
	const [isModalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [modalTitle, setModalTitle] = useState('Title');

	const closeModal = () => {
		setModalOpen(false);
		setModalContent(null);
	};
	const handleOpenMaterialForm = () => {
		setModalContent(<MaterialForm handleClose={closeModal} />);
		setModalOpen(true);
		setModalTitle(t('form.title'));
	};

	const handleEditMaterial = (materialId) => {
		if(materialId === null || materialId === undefined) return;
		setModalContent(<MaterialForm handleClose={closeModal} loadMaterial={parseInt(materialId)} />);
		setModalTitle(t('form.updateTitle'));
		setModalOpen(true);
	}

	useEffect(() => {
		//handleOpenMaterialForm()
	},[])
	

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<div className='w-full flex justify-end'>
					<button className='btn btn-primary btn-sm' onClick={handleOpenMaterialForm}>
						{'+' + t('btnNew')}
					</button>
				</div>
				<h3 className='text-2xl py-2 font-semibold'>{t('title')}</h3>
				<p className='opacity-80'>{t('lead')}</p>

				<MaterialTable handleEdit={handleEditMaterial} />
				
			</Card>
			{isModalOpen && (
				<ResponsiveModal title={modalTitle} handleCloseBtn={closeModal} width='lg:max-w-4xl'>
					{modalContent}
				</ResponsiveModal>
			)}
		</>
	);
}
