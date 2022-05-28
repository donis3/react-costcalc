import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt, FaInfoCircle } from 'react-icons/fa';
import ThSortable from '../../components/common/ThSortable';

import ReactTooltip from 'react-tooltip';

import useSortTableByField from '../../hooks/app/useSortTableByField';
import useIntl from '../../hooks/common/useIntl';
import usePagination from '../../hooks/common/usePagination';
import TablePagination from '../../components/tables/TablePagination';
import useProducts from '../../context/products/useProducts';

export default function ProductsTable({ handleOpen = null } = {}) {
	const { t } = useTranslation('pages/products');
	const [sortingState, sortBy] = useSortTableByField('products', ['name', 'code', 'production'], 'productId');
	const { products } = useProducts();

	const { rows, currentPage, onPageChange, totalPages, count } = usePagination({
		table: products.getAllSorted({ field: sortingState.field, asc: sortingState.asc }),
		name: 'Products',
	});

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

						<ThSortable className='w-5/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('table.name')}
						</ThSortable>

						<ThSortable className='w-2/12' field='code' sortingState={sortingState} handleSort={sortBy}>
							{t('table.code')}
						</ThSortable>

						<ThSortable className='w-2/12' field='production' sortingState={sortingState} handleSort={sortBy}>
							{t('table.production')}
						</ThSortable>

						<ThSortable className='w-2/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{products &&
						rows.map((item, i) => {
							return <ProductTableRow index={i} key={i} data={item} action={handleOpen} />;
						})}
				</tbody>
			</table>
			<TablePagination current={currentPage} total={totalPages} handler={onPageChange} itemCount={count} />
		</div>
	);
}

//Table Rows
function ProductTableRow({ data = null, index = 0, action = null }) {
	const { displayNumber } = useIntl();
	//Data Check
	if (!data || typeof data !== 'object' || Object.keys(data).includes('productId') === false) return <></>;

	//Tooltips
	const tooltipId = `Products-${index}`;

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
					<ReactTooltip id={tooltipId} type='light' />
				</th>
				{/* Column 2 */}
				<td className='whitespace-normal cursor-pointer font-medium' onClick={() => action('info', data.productId)}>
					{data?.name}
				</td>
				{/* Column 3 */}
				<td className='truncate' title={data?.code}>
					{data?.code}
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
