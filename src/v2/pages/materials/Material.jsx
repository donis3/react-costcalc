import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaInfo as InfoIcon, FaChartLine as CostIcon } from 'react-icons/fa';

import CardWithTabs from '../../components/common/CardWithTabs';
import Button from '../../components/common/Button';
import MaterialDetails from './details/MaterialDetails';
import MaterialHistory from './details/MaterialHistory';
import DocumentDates from '../../components/common/DocumentDates';
import useApp from '../../context/app/useApp';
import useMaterials from '../../context/materials/useMaterials';

export default function Material() {
	const { t } = useTranslation('pages/materials', 'translation');
	const { materialId } = useParams();
	const { page } = useApp();
	const navigate = useNavigate();
	const { Materials } = useMaterials();
	const material = Materials.findById(materialId, true);

	useEffect(() => {
		if (!material) {
			toast.warning(t('error.itemNotFound', { ns: 'translation', item: t('name') }));
			navigate('/materials');
		} else {
			//Calculate prices and save to db
			Materials.recordPriceForMaterial(material);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [material]);

	useEffect(() => {
		if (material && page && page.setBreadcrumb) page.setBreadcrumb(material.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!material) return <></>;

	//Define tabs
	const tabs = [
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<InfoIcon /> {t('tabs.itemDetails', { ns: 'translation', item: t('name') })}
				</span>
			),
			body: <MaterialDetails material={material} />,
		},
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<CostIcon /> {t('tabs.priceHistory', { ns: 'translation' })}
				</span>
			),
			body: <MaterialHistory materialId={material?.materialId} />,
		},
	];

	//Render
	return (
		<>
			<CardWithTabs
				tabs={tabs}
				headerContent={
					<Link to={`/materials/edit/${material?.materialId}`}>
						<Button.Edit />
					</Link>
				}
				title={material?.name}
				module='materials'
				role='view'
			/>
			<DocumentDates updatedAt={material?.updatedAt} createdAt={material?.createdAt} />
		</>
	);
}
