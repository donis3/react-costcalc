import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../common/Card';
import ResponsiveModal from '../../common/ResponsiveModal';
import MaterialForm from './MaterialForm';
import MaterialTable from './MaterialTable';

export default function Materials() {
	const { t } = useTranslation('pages/materials');
	const [isModalOpen, setModalOpen] = useState(false);

	const closeModal = () => {
		setModalOpen(false);
	};
	const handleOpenMaterialForm = () => {
		setModalOpen(true);
	};
	

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

				<MaterialTable />
				
			</Card>
			{isModalOpen && (
				<ResponsiveModal title='test' handleCloseBtn={closeModal}>
					<MaterialForm handleClose={closeModal} />
				</ResponsiveModal>
			)}
		</>
	);
}
