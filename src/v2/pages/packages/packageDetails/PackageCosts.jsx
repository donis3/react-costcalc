import React from 'react';
import { useTranslation } from 'react-i18next';
import DateMoneyChart from '../../../components/charts/DateMoneyChart';
import { sortArrayNumeric } from '../../../lib/common';

export default function PackageCosts({ packageData } = {}) {
	const { t } = useTranslation('pages/packages', 'translation');
	//IF no data to show, render no data text
	const { costHistory } = packageData;
	if (!costHistory || !Array.isArray(costHistory) || costHistory.length === 0) {
		return <p className='text-sm opacity-75 italic'>{t('error.noData', {ns: 'translation'})}</p>;
	}

	//Sort ascending dates
	const sortedData = sortArrayNumeric(costHistory, 'date', true);

	//Prepare data for chart
	const chartData = sortedData.reduce((accumulator, item) => {
		const chartItem = {
			x: new Date(item.date),
			y: Math.round(item.cost * 100) / 100,
		};
		return [...accumulator, chartItem];
	}, []);

	//Render chart
	return (
		<div className='w-full flex justify-center'>
			<div className='flex-1 lg:max-w-2xl'>
				<DateMoneyChart
					data={chartData}
					label={packageData.name}
					title={t('package.costHistoryTitle', { item: packageData.name })}
				/>
			</div>
		</div>
	);
}
