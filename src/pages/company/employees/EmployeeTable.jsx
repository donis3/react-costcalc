import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ThSortable from '../../../components/common/ThSortable';

import useCompanyEmployees from '../../../context/company/useCompanyEmployees';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useIntl from '../../../hooks/common/useIntl';
import Button from '../../../components/common/Button';

export default function EmployeeTable() {
	const { t } = useTranslation('pages/company');

	const { getAll, sorting } = useCompanyEmployees();
	const [sortingState, sortBy] = useSortTableByField('employees', sorting.fields, sorting.default);

	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal  table-compact'>
				<thead>
					<tr>
						<ThSortable className='w-4/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('table.name')}
						</ThSortable>

						<ThSortable className='w-3/12' field='department' sortingState={sortingState} handleSort={sortBy}>
							{t('table.department')}
						</ThSortable>

						<ThSortable className='w-2/12' field='doe' sortingState={sortingState} handleSort={sortBy}>
							{t('table.doe')}
						</ThSortable>

						<ThSortable className='w-2/12' field='grossLocal' sortingState={sortingState} handleSort={sortBy}>
							{t('table.gross')}
						</ThSortable>

						<ThSortable className='w-1/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{getAll(sortingState).map((employee, index) => (
						<EmployeeTableRow key={index} employee={employee} />
					))}
				</tbody>
			</table>
		</div>
	);
}

function EmployeeTableRow({ employee } = {}) {
	const { displayDate, displayMoney } = useIntl();
	const { employeeId = null, name = '', department = '', doe = '', gross = 0, currency } = employee;

	if (!employeeId) return <></>;
	return (
		<tr className='hover'>
			<td className='whitespace-normal truncate'>
				<Link to={`/company/employees/${employeeId}`} className='link-hover'>
					{name}
				</Link>
			</td>
			<td>{department}</td>
			<td>{displayDate(doe, { time: false })}</td>
			<td>{displayMoney(gross, currency)}</td>
			<td className='flex flex-wrap gap-x-1'>
				<Link to={`/company/employees/edit/${employeeId}`}>
					<Button.EditSmall />
				</Link>
			</td>
		</tr>
	);
}
