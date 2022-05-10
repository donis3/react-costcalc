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
import useIntl from '../../../hooks/common/useIntl';
import { useCurrencyContext } from '../../../context/MainContext';
import { useAppContext } from '../../../context/AppContext';
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

export default function CostsChart({ overhead = [], labor = [] } = {}) {
	const { t } = useTranslation('pages/homepage', 'translation');
	const { displayDate, displayMoney } = useIntl();
	const { currencies } = useCurrencyContext();
	const { language } = useAppContext();
	const [dateLocale, setDateLocale] = useState(null);
	//Will lazy load a locale for date functions to be able to localize dates
	useEffect(() => {
		async function loadDateLocale() {
			let { [language.code]: newLocale } = await import('date-fns/locale');
			setDateLocale(() => newLocale);
		}
		loadDateLocale();
	}, [language.code]);
	//Constants
	const defaultCurrency = currencies.defaultCurrency;
	const colors = ['58, 134, 255', '251, 86, 7'];
	function getColor(index = 0, bg = false) {
		if (!colors?.[index]) index = 0;
		if (bg) {
			return `rgba(${colors[index]}, 0.5)`;
		} else {
			return `rgb(${colors[index]})`;
		}
	}

	//Validate
	if (!Array.isArray(overhead)) overhead = [];
	if (!Array.isArray(labor)) labor = [];
	if (overhead.length + labor.length === 0) {
		return <p className='text-lg font-light italic'>{t('widgets.noHistoryData')}</p>;
	}

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
				text: t('widgets.historyChartTitle'),
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem, data) {
						return `${tooltipItem.dataset.label}: ${displayMoney(tooltipItem.parsed.y)}`;
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
				// suggestedMax: 100,
				suggestedMin: 0,
				ticks: {
					// For a category axis, the val is the index so the lookup via getLabelForValue is needed
					callback: function (val, index) {
						//Return currency for the first row
						return index === 0 ? defaultCurrency : this.getLabelForValue(val);
					},
					//color: 'rgb(255, 99, 132)',
				},
			},
		},
	};


	const chartData2 = {
		datasets: [
			{
				label: t('totals.overhead'),
				data: overhead.map((item) => {
					return { x: new Date(item.date), y: item.amount };
				}),
				borderColor: getColor(0, false),
				backgroundColor: getColor(0, true),
			},
			{
				label: t('totals.labour'),
				data: labor.map((item) => {
					return { x: new Date(item.date), y: item.amount };
				}),
				borderColor: getColor(1, false),
				backgroundColor: getColor(1, true),
			},
		],
	};

	return <Line options={options} data={chartData2} />;
}
