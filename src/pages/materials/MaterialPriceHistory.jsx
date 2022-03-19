import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DateMoneyChart from '../../components/charts/DateMoneyChart';
import ResponsiveModal from '../../components/common/ResponsiveModal';
import { useMaterialContext } from '../../context/MainContext';

export default function MaterialPriceHistory({ handleClose = null, materialId = null }) {
	//Load dependencies
	const { Materials } = useMaterialContext();
	const { t } = useTranslation('pages/materials');
	const material = Materials.findById(materialId, true);
	let priceHistory = [];

	useEffect(() => {
		Materials.recordPriceForMaterial(material);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [material]);

	if (material && Array.isArray(material?.priceHistory) && material.priceHistory.length > 0) {
		priceHistory = material.priceHistory;
	}
	//Prepare chart data
	const chartData = priceHistory.map((item) => {
		return {
			x: new Date(item.date),
			y: item.amount,
		};
	});

	//Show data
	return (
		<ResponsiveModal title={t('priceHistory.title', { name: material.name })} handleClose={handleClose} autoFooter>
			<DateMoneyChart currency='TRY' data={chartData} label={material.name} title={t('priceHistory.chartTitle')} />
		</ResponsiveModal>
	);
}
