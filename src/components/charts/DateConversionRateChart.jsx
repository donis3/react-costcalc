import React, { useState, useEffect } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	TimeSeriesScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
//import { tr } from 'date-fns/locale';

import useIntl from '../../hooks/common/useIntl';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	TimeSeriesScale
);

export default function DateConversionRateChart({ data = null, from = null, to = null } = {}) {
	const { displayDate, displayNumber } = useIntl();
	const { language } = useAppContext();
	const [dateLocale, setDateLocale] = useState(null);
	const { t } = useTranslation('translation');

	const max = Array.isArray(data) ? Math.max(...data.map((item) => item.y)) : 0;
	const min = Array.isArray(data) ? Math.min(...data.map((item) => item.y)) : 0;

	//Will lazy load a locale for date functions to be able to localize dates
	useEffect(() => {
		async function loadDateLocale() {
			let { [language.code]: newLocale } = await import('date-fns/locale');
			setDateLocale(() => newLocale);
		}
		loadDateLocale();
	}, [language.code]);

	const options = {
		locale: language.locale || 'en-EN',
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom',
				align: 'start',
			},
			title: {
				display: true,
				text: t('charts.rateChartTitle', { from, to }),
			},
			tooltip: {
				callbacks: {
					// footer: (tooltipItems) => {
					// 	let sum = 0;
					// 	tooltipItems.forEach(function (tooltipItem) {
					// 		sum += tooltipItem.parsed.y;
					// 	});
					// 	return 'Sum: ' + sum;
					// },
					label: function (tooltipItem, data) {
						//return `${tooltipItem.dataset.label}: ${displayMoney(tooltipItem.parsed.y, currency)}`;
						return displayNumber(tooltipItem.parsed.y, 2);
					},
					title: function (tooltipItem, data) {
						const timestamp = tooltipItem[0].parsed.x;
						//console.log(displayDate(timestamp))
						return displayDate(timestamp);
					},
				},
			},
		},
		scales: {
			xAxis: {
				type: 'time',
				time: {
					//unit: 'month',
					// displayFormats: {
					// 	quarter: 'MMM YYYY',
					// },
				},
				adapters: {
					date: {
						locale: dateLocale,
					},
				},
			},
			yAxis: {
				// min: 0,
				suggestedMax: max + 1,
				suggestedMin: min > 0 ? min - 1 : 0,
				ticks: {
					// For a category axis, the val is the index so the lookup via getLabelForValue is needed
					callback: function (val, index) {
						//Return currency for the first row
						return this.getLabelForValue(val);
					},
					//color: 'rgb(255, 99, 132)',
				},
			},
		},
	};

	const chartData2 = {
		datasets: [
			{
				label: t('charts.rateChartLabel', { from, to }),
				data: data,
				borderColor: 'rgba(8, 27, 68, 1)',
				backgroundColor: 'rgba(26, 79, 192, 0.7)',
			},
		],
	};

	return <Line options={options} data={chartData2} />;
}
