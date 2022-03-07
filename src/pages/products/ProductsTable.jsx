import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown, FaCaretUp, FaPencilAlt, FaInfoCircle } from 'react-icons/fa';
import ThSortable from '../../components/common/ThSortable';
import { useProductsContext } from '../../context/MainContext';
import ReactTooltip from 'react-tooltip';

import useSortTableByField from '../../hooks/app/useSortTableByField';
import useIntl from '../../hooks/common/useIntl';
import useConfig from '../../hooks/app/useConfig';

export default function ProductsTable({ handleOpen = null } = {}) {
	const { t } = useTranslation('pages/products');
	const [sortingState, sortBy] = useSortTableByField('products', ['name', 'code', 'cost', 'production'], 'productId');
	const { products } = useProductsContext();

	//Products table is empty
	if (products.count() === 0) {
		return <>{/* No product */}</>;
	}

	//Display products
	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal table-fixed table-compact'>
				<thead>
					<tr>
						{/* Table Headers */}
						<ThSortable className='w-1/12 font-semibold'>#</ThSortable>

						<ThSortable className='w-3/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('table.name')}
						</ThSortable>

						<ThSortable className='w-2/12' field='code' sortingState={sortingState} handleSort={sortBy}>
							{t('table.code')}
						</ThSortable>

						<ThSortable className='w-2/12' field='cost' sortingState={sortingState} handleSort={sortBy}>
							{t('table.cost')}
						</ThSortable>

						<ThSortable className='w-2/12' field='production' sortingState={sortingState} handleSort={sortBy}>
							{t('table.production')}
						</ThSortable>

						<ThSortable className='w-2/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{products &&
						products.getAllSorted({ field: sortingState.field, asc: sortingState.asc }).map((item, i) => {
							return <ProductTableRow index={i} key={i} data={item} action={handleOpen} />;
						})}
				</tbody>
			</table>
		</div>
	);
}

//Table Rows
function ProductTableRow({ data = null, index = 0, action = null }) {
	const { t } = useTranslation('pages/products', 'translation');
	const { displayNumber, displayMoney } = useIntl();
	

	//Data Check
	if (!data || typeof data !== 'object' || Object.keys(data).includes('productId') === false) return <></>;
	const costWithStyle = data.getCostWithStyle();
	
	//const costWithStyle = {cost: 50.2, previous: 25.2, currency: 'TRY', change: 10};

	//Tooltips
	const tooltipId = `Products-${index}`;

	//Stylized Cost
	let costClass = '';
	let costContent = displayMoney(costWithStyle.cost, costWithStyle.currency);
	let costTitle = null;

	if (costWithStyle.change > 0) {
		//Cost increase
		costClass = 'font-medium';
		costContent = (
			<div className='flex'>
				{displayMoney(costWithStyle.cost, costWithStyle.currency)} <FaCaretUp className='text-error-content' />
			</div>
		);
		costTitle = t('table.costChange', {
			previous: displayMoney(costWithStyle.previous, costWithStyle.currency),
			change: `+%${displayNumber(costWithStyle.change, 2)}`,
		});
	} else if (costWithStyle.change < 0) {
		//Cost decrease
		costClass = 'font-medium';
		costContent = (
			<div className='flex'>
				{displayMoney(costWithStyle.cost, costWithStyle.currency)} <FaCaretDown className='text-success-content' />
			</div>
		);
		costTitle = t('table.costChange', {
			previous: displayMoney(costWithStyle.previous, costWithStyle.currency),
			change: `-%${displayNumber(Math.abs(costWithStyle.change), 2)}`,
		});
	}

	//Production
	let productionText = '';
	let productionTitle = '';
	if (data?.productionMass && data.productionMass > 0) {
		if (data.productionMass < 1000) {
			//Show in kg
			productionText = displayNumber(data.productionMass, 2) + ' kg';
		} else {
			//Show in T
			productionText = displayNumber(data.productionMass / 1000, 2) + ' T';
			productionTitle = displayNumber(data.productionMass, 2) + ' kg';
		}
	}

	//Return table row
	return (
		<>
			<tr className='hover'>
				{/* Column 1 */}
				<th>
					{index + 1}
					{/* Tooltip Component for products page */}
					<ReactTooltip id={tooltipId} type='light'  />
				</th>
				{/* Column 2 */}
				<td className='whitespace-normal cursor-pointer font-medium' onClick={() => action('info', data.productId)}>
					{data?.name}
				</td>
				{/* Column 3 */}
				<td className='truncate' title={data?.code}>
					{data?.code}
				</td>
				{/* Column 4 */}
				<td className={costClass} data-tip={costTitle} data-for={tooltipId}>
					{costContent}
				</td>
				{/* Column 5 */}
				<td data-tip={productionTitle} data-for={tooltipId}>
					{productionText}
				</td>
				{/* Column 6 */}
				<td>
					<button type='button' className='btn btn-sm btn-ghost mr-1' onClick={() => action('edit', data.productId)}>
						<FaPencilAlt />
					</button>
					<button type='button' className='btn btn-sm btn-ghost' onClick={() => action('info', data.productId)}>
						<FaInfoCircle />
					</button>
				</td>
			</tr>
		</>
	);
}
