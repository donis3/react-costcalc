import React from 'react';
import { useTranslation } from 'react-i18next';
import DateMoneyChart from '../../../components/charts/DateMoneyChart';
import { sortArrayNumeric } from '../../../lib/common';

export default function EndProductCost({ data = null } = {}) {
	const { costHistory } = data;
	const { t } = useTranslation('pages/endproducts', 'translation');

	
	if (!costHistory) return <></>;
	if (!costHistory || !Array.isArray(costHistory) || costHistory.length === 0) {
		return <p className='text-sm opacity-75 italic'>{t('error.noData', { ns: 'translation' })}</p>;
	}

	//Sort ascending dates
	const sortedData = sortArrayNumeric(costHistory, 'date', true);

	//Prepare data for chart
	const chartData = sortedData.reduce((accumulator, item) => {
        
		const chartItem = {
			x: new Date(item.date),
			y: Math.round(item.amount * 100) / 100,
		};
		return [...accumulator, chartItem];
	}, []);

	//Render chart
	return (
		<div className='w-full flex justify-center min-h-[300px]'>
			<div className='flex-1 lg:max-w-2xl'>
				<DateMoneyChart data={chartData} label={data.name} title={t('endProduct.costHistoryTitle', { item: data.name })} />
			</div>
		</div>
	);
}
