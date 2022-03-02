import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCaretDown, FaCaretUp, FaInfoCircle, FaPencilAlt } from 'react-icons/fa';
import { useMaterialContext } from '../../context/MainContext';
import useSortTableByField from '../../hooks/app/useSortTableByField';

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
						<th className='w-1/12 font-semibold'>#</th>
						<th className='w-5/12'>
							<ThButton field='name' sortingState={sortingState} handler={sortBy}>
								{t('table.material')}
							</ThButton>
						</th>
						<th className='w-1/12'>
							<ThButton field='unit' sortingState={sortingState} handler={sortBy}>
								{t('table.unit')}
							</ThButton>
						</th>
						<th className='w-1/12'>
							<ThButton field='tax' sortingState={sortingState} handler={sortBy}>
								{t('table.tax')}
							</ThButton>
						</th>
						<th className='w-2/12'>
							<ThButton field='price' sortingState={sortingState} handler={sortBy}>
								{t('table.price')}
							</ThButton>
						</th>
						<th className='w-2/12'></th>
					</tr>
				</thead>
				<tbody>
					{Materials.getAll(sortingState).map((material, index) => {
						return <MaterialTableRow key={index} index={index} {...material} openModal={openModal} />;
					})}
				</tbody>
			</table>
		</div>
	);
}

//Table Header Cells with sorting ability
function ThButton({ children, field = null, handler = null, sortingState = null }) {
	if (!field || !handler || !sortingState) {
		return <>{children}</>;
	}
	const btnClass = 'uppercase font-semibold flex items-center gap-1 w-auto mr-1';

	if (sortingState.field === field) {
		return (
			<button onClick={() => handler(field)} className={btnClass + ' underline'}>
				{children}
				{sortingState.asc ? <FaCaretUp className='opacity-50' /> : <FaCaretDown className='opacity-50' />}
			</button>
		);
	}
	return (
		<button onClick={() => handler(field)} className={btnClass}>
			{children}
		</button>
	);
}

//Table Rows
function MaterialTableRow({ materialId, name, unit, tax, price, index = 0, openModal = null}) {
	return (
		<tr className='hover'>
			<th>{index + 1}</th>
			<td className='whitespace-normal'>
				<span className='font-medium cursor-pointer' onClick={() => openModal?.('info', materialId)}>
					{name}
				</span>
			</td>
			<td className='truncate' title={unit}>
				{unit}
			</td>
			<td>{tax}</td>
			<td>{price}</td>
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
