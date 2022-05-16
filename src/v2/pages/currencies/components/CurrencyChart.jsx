import React from 'react';
import DateConversionRateChart from '../../../components/charts/DateConversionRateChart';

export default function CurrencyChart({ data = [], from, to }) {
	if (!Array.isArray(data)) data = [];
	
	const chartData = data.map((item) => {
		return {
			x: new Date(item.date),
			y: item.rate,
		};
	});

	if (chartData.length === 0) {
		return <></>;
	}
	return <DateConversionRateChart data={chartData} from={from} to={to} />;
}
