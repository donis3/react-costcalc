import React from 'react';
import { useTranslation } from 'react-i18next';
import ThSortable from '../../../components/common/ThSortable';
import TablePagination from '../../../components/tables/TablePagination';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import usePagination from '../../../hooks/common/usePagination';

import EndProductsTableRow from './EndProductsTableRow';

export default function EndProductsTable({ endProducts }) {
	const { t } = useTranslation('pages/endproducts', 'translation');
	const [sortingState, sortBy] = useSortTableByField(
		'endproducts',
		['name', 'recipeName', 'packageName', 'totalCostWithTax'],
		'name'
	);

	const sortedProducts = endProducts?.getAllSorted(sortingState) || [];
	

	const { rows, currentPage, onPageChange, totalPages, count } = usePagination({
		table: sortedProducts,
		name: 'Endproducts',
	});

	//No Product
	if (sortedProducts.length === 0) {
		return <div className='mt-10 opacity-50'>{t('endProducts.noData')}</div>;
	}
	//Show Table
	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal table-fixed table-compact'>
				<thead>
					<tr>
						{/* Table Headers */}

						<ThSortable className='w-3/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.name', { ns: 'translation' })}
						</ThSortable>

						<ThSortable className='w-3/12' field='recipeName' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.recipe', { ns: 'translation' })}
						</ThSortable>

						<ThSortable className='w-3/12' field='packageName' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.package', { ns: 'translation' })}
						</ThSortable>

						<ThSortable className='w-2/12' field='totalCostWithTax' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.cost', { ns: 'translation' })}
						</ThSortable>

						<ThSortable className='w-1/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{rows.map((item, i) => (
						<EndProductsTableRow key={i} data={item} />
					))}
				</tbody>
			</table>
			<TablePagination current={currentPage} total={totalPages} handler={onPageChange} itemCount={count} />
		</div>
	);
}
