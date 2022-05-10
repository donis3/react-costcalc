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

export default function ProductionChart({ production = [] } = {}) {
	const { t } = useTranslation('pages/homepage', 'translation');
	const { displayDate, displayNumber } = useIntl();

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

	if (!Array.isArray(production) || production.length === 0 || 'unit' in production[0] === false) {
		//Invalid Data
		return <p className='text-lg font-light italic'>{t('widgets.noHistoryData')}</p>;
	}
	//Constants
	const unit = production[0].unit;
	const colors = ['58, 134, 255'];

	//Helpers
	function getColor(index = 0, bg = false) {
		if (!colors?.[index]) index = 0;
		if (bg) {
			return `rgba(${colors[index]}, 0.5)`;
		} else {
			return `rgb(${colors[index]})`;
		}
	}

	//Chart Opts
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
				text: t('widgets.productionHistoryChartTitle'),
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem, data) {
						return displayNumber(tooltipItem.parsed.y, 2) + ' ' + unit;
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
						const unitLong = t(`units.${unit}`, { ns: 'translation' });
						return index === 0 ? unitLong : this.getLabelForValue(val);
					},
					//color: 'rgb(255, 99, 132)',
				},
			},
		},
	};

	const chartData2 = {
		datasets: [
			{
				label: t('totals.production'),
				data: production.map((item) => {
					return { x: new Date(item.date), y: item.totalProduction };
				}),
				borderColor: getColor(0, false),
				backgroundColor: getColor(0, true),
			},
		],
	};

	return <Line options={options} data={chartData2} />;
}
