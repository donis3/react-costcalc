import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import Button from '../../components/common/Button';
import CardWithTabs from '../../components/common/CardWithTabs';
import DocumentDates from '../../components/common/DocumentDates';
import { useEndProductsContext } from '../../context/MainContext';
import { FaInfo as InfoIcon, FaChartLine as CostIcon } from 'react-icons/fa';
import EndProductInfo from './details/EndProductInfo';
import EndProductCost from './details/EndProductCost';
import { useAppContext } from '../../context/AppContext';

export default function EndProduct() {
	const { endId } = useParams();
	const { page } = useAppContext();
	const navigate = useNavigate();
	const { endProducts } = useEndProductsContext();
	const endProduct = useMemo(() => endProducts.findById(endId, true), [endId, endProducts]);
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
			body: <EndProductInfo data={endProduct} />,
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
			<BackButton />
			<CardWithTabs
				tabs={tabs}
				headerContent={
					<Link to={`/endproducts/edit/${endProduct.endId}`}>
						<Button.Edit type='button' className='btn btn-sm' />
					</Link>
				}
			/>
			<DocumentDates updatedAt={endProduct?.updatedAt} createdAt={endProduct?.createdAt} />
		</>
	);
}
