import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import ProductsTable from './ProductsTable';
import ProductForm from './ProductForm';
import ProductInfo from './ProductInfo';
import Button from '../../components/common/Button';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function Products() {
	const { t } = useTranslation('pages/products', 'translation');
	const [modalState, setModalState] = useState({ isOpen: false, type: 'info', productId: 0 });

	//Modal Handler
	const openModal = (type = null, productId = null) => {
		//Check Type
		if (['add', 'edit', 'info'].includes(type) === false) return;
		//Check Product Id
		productId = parseInt(productId);
		if (['edit', 'info'].includes(type) && isNaN(productId)) return;
		//Set State
		setModalState({ isOpen: true, type, productId });
	};
	const closeModal = () => setModalState({ isOpen: false, type: 'add', productId: null });

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('title')} module='products' role='main'>
					{/* Links */}
					<Button.New name={t('name')} onClick={() => openModal('add')} />
				</ModuleHeader>
				{/* Lead Text */}
				<p className='opacity-80'>{t('lead')}</p>

				{/* Main Table */}
				<ProductsTable handleOpen={openModal} handleClose={closeModal} />
			</Card>

			{/* Modals */}
			{modalState.isOpen && modalState.type === 'add' && <ProductForm handleClose={closeModal} />}
			{modalState.isOpen && modalState.type === 'edit' && (
				<ProductForm handleClose={closeModal} productId={modalState.productId} />
			)}
			{modalState.isOpen && modalState.type === 'info' && (
				<ProductInfo handleClose={closeModal} productId={modalState.productId} />
			)}
		</>
	);
}
