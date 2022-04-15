import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import useIntl from '../../hooks/common/useIntl';
import { sortArrayNumeric } from '../../lib/common';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

const maxItemCount = 6;

export default function CostAnalysisChart({ data = null, title = null }) {
	const { displayMoney } = useIntl();
	const { t } = useTranslation('translation');

	if (!data || 'labels' in data === false || 'data' in data === false) return <></>;
	if (!Array.isArray(data.labels) || data.labels.length === 0) return <></>;
	if (!Array.isArray(data.data) || data.data.length === 0) return <></>;
	if (data.data.length !== data.labels.length) {
		console.warn('Chart data is inconsistent.');
	}
	let useGroupedData = data.data.length > maxItemCount;
	let groupedData = { labels: [], data: [] };

	//CALCULATE GROUPED DATA if chart item count exceeds limits...
	if (useGroupedData) {
		let combinedData = data.labels.map((label, index) => {
			return { label: label, value: data.data[index] };
		});
		//Sort data
		combinedData = sortArrayNumeric(combinedData, 'value', false);
		//get first first max-1 elements
		let mainItems = combinedData.slice(0, maxItemCount - 1);
		let excessItems = combinedData.slice(maxItemCount - 1);
		//Combine excess as a single item
		const excess = excessItems.reduce(
			(acc, item) => {
				return { ...acc, value: acc.value + item.value };
			},
			{ label: t('charts.other'), value: 0 }
		);
		//combine excess and main items in grouped data
		combinedData = [...mainItems, excess];
		//seperate labels and data for chart
		groupedData = combinedData.reduce(
			(acc, item) => {
				return {
					labels: [...acc.labels, item.label],
					data: [...acc.data, item.value],
				};
			},
			{ labels: [], data: [] }
		);
	}

	const chartData = {
		labels: useGroupedData ? groupedData.labels : data.labels,
		datasets: [
			{
				data: useGroupedData ? groupedData.data : data.data,
				backgroundColor: [
					'rgba(255, 99, 132, 0.6)',
					'rgba(255, 206, 86, 0.6)',
					'rgba(54, 162, 235, 0.6)',
					'rgba(75, 192, 192, 0.6)',
					'rgba(153, 102, 255, 0.6)',
					'rgba(255, 159, 64, 0.6)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 2,
				spacing: 0,
			},
		],
	};
	const chartOptions = {
		cutout: '20%',
		rotation: 0,
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom',
				align: 'start',
			},
			title: {
				display: title ? true : false,
				text: title,
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem) {
						return displayMoney(tooltipItem.parsed);
					},
					title: function (tooltipItem) {
						return tooltipItem[0].label;
					},
				},
			},
		},
	};

	return <Doughnut data={chartData} options={chartOptions} />;
}
