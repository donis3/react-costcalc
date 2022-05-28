import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ThSortable from '../../components/common/ThSortable';
import TablePagination from '../../components/tables/TablePagination';
import useMaterials from '../../context/materials/useMaterials';
import useSortTableByField from '../../hooks/app/useSortTableByField';

import useIntl from '../../hooks/common/useIntl';
import usePagination from '../../hooks/common/usePagination';

export default function MaterialTable() {
	const { t } = useTranslation('pages/materials');
	const { Materials } = useMaterials();
	const [sortingState, sortBy] = useSortTableByField('materials', Materials.fields, Materials.fields[0]);

	const { rows, currentPage, onPageChange, totalPages, count } = usePagination({
		table: Materials.getAll(sortingState),
		name: 'Materials',
	});

	if (!Materials || Materials.count() <= 0) {
		//No data
		return <p className='italic opacity-75 mt-3 text-sm'>{t('nodata')}</p>;
	}

	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal table-fixed table-compact'>
				<thead>
					<tr>
						{/* Table Headers */}
						<ThSortable className='w-1/12 font-semibold'>#</ThSortable>

						<ThSortable className='w-4/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('table.material')}
						</ThSortable>

						<ThSortable className='w-3/12' field='provider' sortingState={sortingState} handleSort={sortBy}>
							{t('table.supplier')}
						</ThSortable>

						<ThSortable className='w-2/12' field='price' sortingState={sortingState} handleSort={sortBy}>
							{t('table.price')}
						</ThSortable>

						<ThSortable className='w-2/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{rows.map((material, index) => {
						return <MaterialTableRow key={index} index={index} data={material} />;
					})}
				</tbody>
			</table>
			<TablePagination current={currentPage} total={totalPages} handler={onPageChange} itemCount={count} />
		</div>
	);
}

//Table Rows
function MaterialTableRow({ data = null, index = 0 }) {
	const { displayMoney } = useIntl();
	if (!data) return <></>;
	const { materialId, name, unit, provider, price, currency } = data;

	return (
		<tr className='hover'>
			<th>{index + 1}</th>
			<td className='whitespace-normal truncate'>
				<Link to={`/materials/${materialId}`} className='link-hover'>
					{name}
				</Link>
			</td>
			<td>{provider}</td>
			<td>
				{displayMoney(price, currency)}
				<span className='text-xs ml-1 opacity-70'>/{unit}</span>
			</td>
			<td className='flex flex-wrap gap-x-1'>
				<Link to={`/materials/edit/${materialId}`} className='btn btn-ghost btn-xs'>
					<FaPencilAlt />
				</Link>
			</td>
		</tr>
	);
}
