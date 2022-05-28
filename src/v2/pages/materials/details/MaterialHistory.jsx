import React from 'react';
import { useTranslation } from 'react-i18next';
import DateMoneyChart from '../../../components/charts/DateMoneyChart';
import useMaterials from '../../../context/materials/useMaterials';

import useUiToggles from '../../../hooks/app/useUiToggles';

export default function MaterialHistory({ materialId }) {
	//Load dependencies

	const { Materials } = useMaterials();
	const { t } = useTranslation('pages/materials');
	const material = Materials.findById(materialId, true);
	let priceHistory = [];
	let currency = material.currency;

	//Ui Options
	const [getOption] = useUiToggles();
	const toggleOptions = [];
	//Which checkboxes to display
	if (material.isForeignCurrency === true) toggleOptions.push('localPrice');

	if (material.isForeignCurrency && getOption('localPrice') === true) {
		if (material && Array.isArray(material?.localPriceHistory) && material.localPriceHistory.length > 0) {
			priceHistory = material.localPriceHistory;
			currency = material.defaultCurrency;
		}
	} else {
		if (material && Array.isArray(material?.priceHistory) && material.priceHistory.length > 0) {
			priceHistory = material.priceHistory;
		}
	}

	//Prepare chart data
	const chartData = priceHistory.map((item) => {
		return {
			x: new Date(item.date),
			y: item.amount,
		};
	});

	return (
		<div className='w-full flex justify-center'>
			<div className='flex-1 lg:max-w-2xl'>
				<DateMoneyChart
					currency={currency}
					data={chartData}
					label={material.name}
					title={t('priceHistory.title', { name: material.name })}
				/>
			</div>
		</div>
	);
}

MaterialHistory.defaultProps = {
	materialId: null,
};
