import React from 'react';
import DateConversionRateChart from '../../components/charts/DateConversionRateChart';

export default function CurrencyChart({ data, from, to }) {
	let chartData = [];
	try {
		if (data && 'date' in data && 'rate' in data) {
			chartData.push({
				x: new Date(data.date),
				y: data.rate,
			});
		}
		if (data && 'history' in data && Array.isArray(data.history)) {
			chartData = data.history.map((item) => {
				return {
					x: new Date(item.date),
					y: item.rate,
				};
			});
		}
	} catch (err) {
		//Error
		console.log(`Error parsing rate history`);
	}

    if( chartData.length === 0) {
        return <></>;
    }
	return <DateConversionRateChart data={chartData} from={from} to={to} />;
}
