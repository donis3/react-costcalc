import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CostAnalysisChart from '../../../components/charts/CostAnalysisChart';
import Card from '../../../components/common/Card';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import ExpenseTotal from './components/ExpenseTotal';
import useExpenseChart from './useExpenseChart';

export default function ExpenseChart() {
	const { t } = useTranslation('pages/company', 'translation');
	const [chartOptions, setChartOptions] = useState({ category: 'all', period: 'y' });
	const { expenses, selectCategoryArray, selectPeriodArray, getChartData, categoryName } = useExpenseChart({
		category: chartOptions.category,
		period: chartOptions.period,
	});

	const handleCategoryChange = (e) => setChartOptions({ ...chartOptions, category: e.target.value });

	const handlePeriodChange = (e) => setChartOptions({ ...chartOptions, period: e.target.value });

	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			<ModuleHeader text={t('expenses.chart')} module='expenses' role='pie' setBreadcrumb />

			<div className='flex flex-col gap-y-10 p-3 items-center'>
				{/* Table options and total cost */}
				<div className='w-full flex flex-col md:flex-row gap-x-10 relative'>
					<div className='flex-1'>
						<ExpenseTotal expenses={expenses} options={{ showPeriod: chartOptions.period }} />
					</div>
					{/* Option Selects */}
					<div className='flex-shrink'>
						<div className='flex flex-col gap-y-2 border rounded-lg'>
							<select className='select' value={chartOptions.category} onChange={handleCategoryChange}>
								{selectCategoryArray.map((item, i) => {
									return (
										<option key={i} value={item.value}>
											{item.name}
										</option>
									);
								})}
							</select>
							<select className='select' value={chartOptions.period} onChange={handlePeriodChange}>
								{selectPeriodArray.map((item, i) => {
									return (
										<option key={i} value={item.value}>
											{item.name}
										</option>
									);
								})}
							</select>
						</div>
					</div>
				</div>

				{/* Chart */}
				<div className='w-3/4 lg:w-1/2'>
					<Chart chartData={getChartData()} category={categoryName} />
				</div>
			</div>
		</Card>
	);
}

function Chart({ chartData, category } = {}) {
	const { t } = useTranslation('translation');
	if (!chartData) return <></>;

	return <CostAnalysisChart data={chartData} title={t('charts.costAnalysis', { item: category })} />;
}
