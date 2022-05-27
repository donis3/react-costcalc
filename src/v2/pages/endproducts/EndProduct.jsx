import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import CardWithTabs from '../../components/common/CardWithTabs';
import DocumentDates from '../../components/common/DocumentDates';

import { FaInfo as InfoIcon, FaChartLine as CostIcon, FaChartPie as AnalysisIcon } from 'react-icons/fa';
import EndProductInfo from './details/EndProductInfo';
import EndProductCost from './details/EndProductCost';

import EndProductAnalysis from './details/EndProductAnalysis';
import useApp from '../../context/app/useApp';
import useEndProduct from '../../context/endproducts/useEndProduct';

export default function EndProduct() {
	const { endId } = useParams();
	const { page } = useApp();
	const navigate = useNavigate();
	const { endProduct, recipeItems, packageItems, labourItems, overheadItems } = useEndProduct(endId);
	const { t } = useTranslation('pages/endproducts');

	//Product not found ?
	useEffect(() => {
		if (!endProduct) return navigate('/endproducts');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endProduct]);

	useEffect(() => {
		page.setBreadcrumb(endProduct?.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endProduct?.name]);

	if (!endProduct) return <></>;

	//Define tabs
	const tabs = [
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<InfoIcon /> {t('endProduct.tabDetails')}
				</span>
			),
			body: (
				<EndProductInfo
					data={endProduct}
					labourItems={labourItems}
					recipeItems={recipeItems}
					packageItems={packageItems}
					overheadItems={overheadItems}
				/>
			),
		},
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<AnalysisIcon /> {t('endProduct.tabCostAnalysis')}
				</span>
			),
			body: (
				<EndProductAnalysis
					data={endProduct}
					labourItems={labourItems}
					recipeItems={recipeItems}
					packageItems={packageItems}
					overheadItems={overheadItems}
				/>
			),
		},
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<CostIcon /> {t('endProduct.tabCostHistory')}
				</span>
			),
			body: <EndProductCost data={endProduct} />,
		},
	];
	return (
		<>
			<CardWithTabs
				tabs={tabs}
				headerContent={
					<Link to={`/endproducts/edit/${endProduct.endId}`}>
						<Button.Edit type='button' className='btn btn-sm' />
					</Link>
				}
				module='endproducts'
				role='view'
				title={endProduct.name}
			/>
			<DocumentDates updatedAt={endProduct?.updatedAt} createdAt={endProduct?.createdAt} />
		</>
	);
}
