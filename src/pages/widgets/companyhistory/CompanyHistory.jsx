import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChartLine as HistoryIcon, FaMoneyBillAlt as CostIcon, FaIndustry as ProductionIcon } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import useCompany from '../../../context/company/useCompany';
import HistoryChart from './CostsChart';
import ProductionChart from './ProductionChart';

export default function CompanyHistory() {
	const { t } = useTranslation('pages/homepage', 'translation');
	const [showChart, setShowChart] = useState('cost');
	const { company } = useCompany();
	const { production = [], overhead = [], labor = [] } = company?.history || {};

	if (!parseInt(production?.length) && !parseInt(overhead?.length) && !parseInt(labor?.length)) {
		return <></>;
	}

	return (
		<div>
			<ReactTooltip effect='solid' multiline id='costHistory' />
			<div className='border-b p-2 flex flex-wrap items-center justify-between rounded-t-md  bg-opacity-80 bg-neutral text-neutral-content'>
				<div className='flex items-center gap-x-2'>
					<HistoryIcon className='text-xl' />
					<h3 className='font-semibold text-xl'>{t('widgets.historyTitle')}</h3>
				</div>
				<div className='flex gap-2 '>
					<button
						type='button'
						className={`gap-2 btn btn-xs btn-ghost ${showChart === 'cost' && 'btn-active'}`}
						onClick={() => setShowChart('cost')}
					>
						{t('widgets.historyCostBtn')}
						<CostIcon />
					</button>
					<button
						type='button'
						className={`gap-2 btn btn-xs btn-ghost ${showChart === 'production' && 'btn-active'}`}
						onClick={() => setShowChart('production')}
					>
						{t('widgets.historyProductionBtn')}
						<ProductionIcon />
					</button>
				</div>
			</div>
			<div className='w-full p-3 min-h-[350px] flex justify-center'>
				<div className='flex-1 max-w-2xl lg:max-w-3xl xl:max-w-4xl'>
					{showChart === 'cost' && <HistoryChart labor={labor} overhead={overhead} />}
					{showChart === 'production' && <ProductionChart production={production} />}
				</div>
			</div>
		</div>
	);
}
