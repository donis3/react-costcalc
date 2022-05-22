import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CostAnalysisChart from '../../../components/charts/CostAnalysisChart';
import OptionControl from '../../../components/common/OptionControl';
import useEndProductCostAnalysis from '../../../context/endproducts/useEndProductCostAnalysis';
import useStorageState from '../../../hooks/common/useStorageState';

export default function EndProductAnalysis({ data = null, recipeItems, packageItems, labourItems } = {}) {
	const { t } = useTranslation('pages/endproducts', 'translation');
	const [displayState, setDisplayState] = useStorageState('displaySettings', {
		localPrice: true,
		baseUnit: false,
		showTax: false,
	});
	const [showAll, setShowAll] = useState(true);
	const { chartData: deepChartData } = useEndProductCostAnalysis({
		recipeItems,
		packageItems,
		labourItems,
		showTax: displayState.showTax,
	});

	return (
		<>
			<div className='w-full py-1 mb-5'>
				<h3 className='text-xl font-medium'>{data.name}</h3>

				<div className='flex justify-between w-full'>
					<h5 className='text-sm opacity-75 mb-5 flex-1 '>{t('costAnalysis.subtitle')}</h5>
					<div className='w-auto flex flex-col gap-y-2'>
						<OptionControl
							state={displayState.showTax}
							setState={(val) => setDisplayState((state) => ({ ...state, showTax: val }))}
							checkboxFirst={false}
							text={t('toggles.includeTax', { ns: 'translation' })}
						/>
						<OptionControl
							state={showAll}
							setState={(val) => setShowAll(() => val)}
							checkboxFirst={false}
							text={t('costAnalysis.showAllMaterialsCost')}
						/>
					</div>
				</div>
			</div>
			<div className='w-full flex justify-center'>
				<div className='lg:flex-grow flex-grow-0 lg:max-w-md w-auto max-w-sm'>
					{showAll ? (
						<CostAnalysisDeep chartData={deepChartData} displayState={displayState} />
					) : (
						<CostAnalysisShallow data={data} displayState={displayState} />
					)}
				</div>
			</div>
		</>
	);
}

function CostAnalysisShallow({ data = null, displayState = null } = {}) {
	const { t } = useTranslation('pages/endproducts', 'translation');
	if (!data || !data.cost || !displayState) return <></>;

	//prepare data
	const chartData = { labels: [], data: [] };

	//Group each cost item and push to chart data arrays
	Object.keys(data.cost).forEach((key) => {
		switch (key) {
			case 'packageCost': {
				chartData.labels.push(t('costAnalysis.packageCost'));
				let cost = data.cost.packageCost;
				if (displayState.showTax) cost += data.cost.packageTax;
				chartData.data.push(cost);
				break;
			}
			case 'recipeCost': {
				chartData.labels.push(t('costAnalysis.recipeCost'));
				let cost = data.cost.recipeCost;
				if (displayState.showTax) cost += data.cost.recipeTax;
				chartData.data.push(cost);
				break;
			}
			case 'labourCost': {
				chartData.labels.push(t('costAnalysis.labourCost'));
				let cost = data.cost.labourCost;
				if (displayState.showTax) cost += data.cost.labourCostTax;
				chartData.data.push(cost);
				break;
			}
			default:
				break;
		}
	});

	return <CostAnalysisChart data={chartData} title={t('costAnalysis.title', { item: data.name })} />;
}

function CostAnalysisDeep({ chartData = null } = {}) {
	const { t } = useTranslation('pages/endproducts', 'translation');

	if (!chartData) return <></>;

	return <CostAnalysisChart data={chartData} title={t('costAnalysis.title')} />;
}
