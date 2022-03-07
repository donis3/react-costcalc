import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle, FaPencilAlt } from 'react-icons/fa';
import ThSortable from '../../components/common/ThSortable';
import { useMaterialContext } from '../../context/MainContext';
import useSortTableByField from '../../hooks/app/useSortTableByField';
import useIntl from '../../hooks/common/useIntl';

export default function MaterialTable({ openModal = null } = {}) {
	const { t } = useTranslation('pages/materials');
	const { Materials } = useMaterialContext();
	const [sortingState, sortBy] = useSortTableByField('materials', Materials.fields, Materials.fields[0]);

	if (Materials.count() <= 0) {
		//No data
		return <></>;
	}

	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal table-fixed table-compact'>
				<thead>
					<tr>
						{/* Table Headers */}
						<ThSortable className='w-1/12 font-semibold'>#</ThSortable>

						<ThSortable className='w-5/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('table.material')}
						</ThSortable>


						<ThSortable className='w-1/12' field='tax' sortingState={sortingState} handleSort={sortBy}>
							{t('table.tax')}
							
						</ThSortable>

						<ThSortable className='w-3/12' field='price' sortingState={sortingState} handleSort={sortBy}>
							{t('table.price')}
						</ThSortable>

						<ThSortable className='w-2/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{Materials.getAll(sortingState).map((material, index) => {
						return <MaterialTableRow key={index} index={index} data={material} openModal={openModal} />;
					})}
				</tbody>
			</table>
		</div>
	);
}

//Table Rows
function MaterialTableRow({ data = null, index = 0, openModal = null }) {
	const { displayMoney, displayNumber } = useIntl();
	if (!data) return <></>;
	const { materialId, name, unit, tax, price, currency } = data;

	return (
		<tr className='hover'>
			<th>{index + 1}</th>
			<td className='whitespace-normal'>
				<span className='font-medium cursor-pointer' onClick={() => openModal?.('info', materialId)}>
					{name}
				</span>
			</td>
			<td>{displayNumber(tax, 2)}<span className='text-xs ml-1 opacity-70'>%</span></td>
			<td>
				{displayMoney(price, currency)}
				<span className='text-xs ml-1 opacity-70'>/{unit}</span>
			</td>
			<td>
				<button className='btn btn-ghost btn-sm mr-1' onClick={() => openModal('edit', materialId)}>
					<FaPencilAlt />
				</button>

				<button className='btn btn-ghost btn-sm' onClick={() => openModal?.('info', materialId)}>
					<FaInfoCircle />
				</button>
			</td>
		</tr>
	);
}
