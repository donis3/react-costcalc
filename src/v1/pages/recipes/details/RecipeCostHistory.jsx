import React from 'react';
import { useTranslation } from 'react-i18next';
import DateMoneyChart from '../../../components/charts/DateMoneyChart';
import ResponsiveModal from '../../../components/common/ResponsiveModal';
import { FaChartLine } from 'react-icons/fa';

export default function RecipeCostHistory({ handleClose, recipe }) {
	const { t } = useTranslation('translation');
	//Prepare data
	let chartData = [];
	if (recipe.unitCosts && Array.isArray(recipe.unitCosts) && recipe.unitCosts.length > 0) {
		chartData = recipe.unitCosts.map((item) => {
			return {
				x: new Date(item.date),
				y: item.cost,
			};
		});
	}
    

	if (!recipe) return <></>;
	//Show data
	return (
		<ResponsiveModal title={recipe.name} icon={<FaChartLine className='text-3xl opacity-75 text-blue-700' />} handleClose={handleClose} autoFooter>
			{/* */}
			<DateMoneyChart data={chartData} label={recipe.name} title={t('charts.itemCostHistory', { name: recipe.name })} />
		</ResponsiveModal>
	);
}
