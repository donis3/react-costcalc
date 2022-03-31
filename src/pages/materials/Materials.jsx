import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../components/common/Card';
import MaterialTable from './MaterialTable';
import MaterialInfo from './MaterialInfo';
import Button from '../../components/common/Button';
import MaterialPriceHistory from './MaterialPriceHistory';
import { Link } from 'react-router-dom';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function Materials() {
	//Translation
	const { t } = useTranslation('pages/materials');

	//Modal open/closed states
	const [modalState, setModalState] = useState({ isOpen: false, type: 'info', materialId: null });

	const openModal = (type = '', materialId = null) => {
		if (['info', 'history'].includes(type) === false) return;
		if (['info', 'history'].includes(type)) {
			materialId = parseInt(materialId);
			if (isNaN(materialId)) return;
		}

		setModalState({ isOpen: true, type: type, materialId: materialId });
	};
	const closeModal = () => {
		setModalState({ isOpen: false, type: 'info', materialId: null });
	};

	//JSX
	return (
		<>
			<Card className='w-full px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={t('title')} module='materials' role='main'>
					<Link to='/materials/add' className='mr-1'>
						<Button.New name={t('name')} />
					</Link>
				</ModuleHeader>
				<p className='opacity-80'>{t('lead')}</p>

				<MaterialTable openModal={openModal} />
			</Card>
			{/* Modals */}
			{modalState.isOpen && modalState.type === 'info' && (
				<MaterialInfo handleClose={closeModal} materialId={modalState.materialId} />
			)}
			{modalState.isOpen && modalState.type === 'history' && (
				<MaterialPriceHistory handleClose={closeModal} materialId={modalState.materialId} />
			)}
		</>
	);
}
