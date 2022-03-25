import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import useIntl from '../../hooks/common/useIntl';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CostAnalysisChart({ data = null, title = null }) {
	const { displayMoney } = useIntl();

	if (!data || 'labels' in data === false || 'data' in data === false) return <></>;

	const chartData = {
		labels: data.labels,
		datasets: [
			{
				
				data: data.data,
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
