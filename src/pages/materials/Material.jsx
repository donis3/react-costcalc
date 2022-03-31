import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMaterialContext } from '../../context/MainContext';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import Button from '../../components/common/Button';

export default function Material() {
	const { t } = useTranslation('pages/materials', 'translation');
	const { materialId } = useParams();
	const { page } = useAppContext();
	const navigate = useNavigate();
	const { Materials } = useMaterialContext();
	const material = Materials.findById(materialId, true);

	useEffect(() => {
		if (!material) {
			toast.warning(t('error.itemNotFound', { ns: 'translation', item: t('name') }));
			navigate('/notfound');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [material]);

	useEffect(() => {
		if (material && page && page.setBreadcrumb) page.setBreadcrumb(material.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//JSX
	return (
		<>
			<Card className='w-full px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader text={material.name} module='materials' role='view'></ModuleHeader>
			</Card>
		</>
	);
}
