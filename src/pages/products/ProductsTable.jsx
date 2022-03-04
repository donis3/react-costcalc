import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown, FaCaretUp, FaPencilAlt, FaInfoCircle } from 'react-icons/fa';
import ThSortable from '../../components/common/ThSortable';
import { useProductsContext } from '../../context/MainContext';
import ReactTooltip from 'react-tooltip';

import useSortTableByField from '../../hooks/app/useSortTableByField';

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
	const { t } = useTranslation('pages/products');

	//Data Check
	if (!data || typeof data !== 'object' || Object.keys(data).includes('productId') === false) return <></>;
	const costWithStyle = data.getCostWithStyle();

	//Tooltips
	const tooltipId = `Products-${index}`;

	//Stylized Cost
	let costClass = '';
	let costContent = costWithStyle.cost.toFixed(2);
	let costTitle = null;

	if (costWithStyle.change > 0) {
		costClass = 'font-medium';
		costContent = (
			<div className='flex'>
				{costWithStyle.cost.toFixed(2)} <FaCaretUp className='text-error-content' />
			</div>
		);
		costTitle = t('table.costChange', {
			previous: costWithStyle.previous.toFixed(2),
			change: `+%${costWithStyle.change}`,
		});
	} else if (costWithStyle.change < 0) {
		costClass = 'font-medium';
		costContent = (
			<div className='flex'>
				{costWithStyle.cost.toFixed(2)} <FaCaretDown className='text-success-content' />
			</div>
		);
		costTitle = t('table.costChange', {
			previous: costWithStyle.previous.toFixed(2),
			change: `-%${Math.abs(costWithStyle.change)}`,
		});
	}

	//Production
	let productionText = '';
	let productionTitle = '';
	if (data?.production && data.production > 0) {
		if (data.production < 1000) {
			productionText = data.production.toFixed(2) + ' kg';
		} else {
			productionText = (data.production / 1000).toFixed(2) + ' T';
			productionTitle = data.production.toFixed(2) + ' kg';
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
					<ReactTooltip id={tooltipId} type='dark' />
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
