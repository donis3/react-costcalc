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
import { useCurrencyContext } from '../../context/MainContext';
import { useAppContext } from '../../context/AppContext';

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

export default function DateMoneyChart({ data = null, title = '', currency = null, label = 'label' } = {}) {
	const { displayDate, displayMoney } = useIntl();
	const { currencies } = useCurrencyContext();
	const { language } = useAppContext();
	const [dateLocale, setDateLocale] = useState(null);

	//Will lazy load a locale for date functions to be able to localize dates
	useEffect(() => {
		async function loadDateLocale() {
			let { [language.code]: newLocale } = await import('date-fns/locale');
			setDateLocale((state) => newLocale);
		}
		loadDateLocale();
	}, [language.code]);

	//Set default currency
	if (!currency) currency = currencies.defaultCurrency;

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
				text: title,
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
						return displayMoney(tooltipItem.parsed.y, currency);
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
				min: 0,
				suggestedMax: 100,
				suggestedMin: 0,
				ticks: {
					// For a category axis, the val is the index so the lookup via getLabelForValue is needed
					callback: function (val, index) {
						//Return currency for the first row
						return index === 0 ? currency : this.getLabelForValue(val);
					},
					//color: 'rgb(255, 99, 132)',
				},
			},
		},
	};

	const chartData2 = {
		datasets: [
			{
				label: label,
				data: data,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
		],
	};

	return <Line options={options} data={chartData2} />;
}
