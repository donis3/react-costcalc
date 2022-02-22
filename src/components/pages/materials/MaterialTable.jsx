import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

export default function MaterialTable() {
	const { materials } = useContext(DataContext);
	const { t } = useTranslation('pages/materials');
	const [sortingState, setSortingState] = useState({ field: 'materialId', asc: true });

	const sortBy = (field = null) => {
		//Validation
		if (!field || materials.getKeys().includes(field) === false) {
			//Invalid field
			return;
		}
		//Copy current state
		let currentState = { field: 'materialId', asc: true };
		if (typeof sortingState === 'object' && 'field' in sortingState && 'asc' in sortingState) {
			currentState = { ...sortingState };
		}

		if (currentState.field === field) {
			//If sorting field is same, change sort order
			currentState.asc = !currentState.asc;
		} else {
			//Sorting a different column. Start with default
			currentState = { field, asc: true };
		}
		//set state
		return setSortingState(currentState);
	};

	if (materials.getCount() <= 0) {
		//No data
		return <></>;
	}

	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal table-fixed table-compact'>
				<thead>
					<tr>
						<th className='w-1/12'>
							<ThButton field='materialId' sortingState={sortingState} handler={sortBy}>
								#
							</ThButton>
						</th>
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
					{materials.getMaterials(sortingState).map((material, index) => {
						return <MaterialTableRow key={index} {...material} actions={null} />;
					})}
				</tbody>
			</table>
		</div>
	);
}

function ThButton({ children, field = null, handler = null, sortingState = null }) {
	if (!field || !handler || !sortingState) {
		return <>{children}</>;
	}
	const btnClass = 'uppercase font-bold flex items-center gap-1 w-auto mr-1';

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

function MaterialTableRow({ materialId, name, unit, tax, price, actions = null }) {
	return (
		<tr className='hover'>
			<th>{materialId}</th>
			<td className='whitespace-normal'>{name}</td>
			<td className='truncate' title={unit}>
				{unit}
			</td>
			<td>{tax}</td>
			<td>{price}</td>
			<td></td>
		</tr>
	);
}
