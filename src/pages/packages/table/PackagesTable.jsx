import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ThSortable from '../../../components/common/ThSortable';
import { usePackagesContext } from '../../../context/MainContext';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useIntl from '../../../hooks/common/useIntl';

export default function PackagesTable() {
	const { packages } = usePackagesContext();
	const { t } = useTranslation('pages/packages', 'translation');
	const [sortingState, sortBy] = useSortTableByField('packages', ['name', 'packageCapacity', 'cost'], 'name');
	const { displayNumber, displayMoney } = useIntl();

	//No package
	if (packages.count() === 0) {
		return <div className='mt-10 opacity-50'>{t('packages.noPackage')}</div>;
	}
	//Show Table
	return (
		<div className='overflow-x-auto my-10'>
			<table className='table table-zebra w-full md:table-normal table-fixed table-compact'>
				<thead>
					<tr>
						{/* Table Headers */}
						<ThSortable className='w-1/12 font-semibold'>#</ThSortable>

						<ThSortable className='w-4/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.name')}
						</ThSortable>

						<ThSortable className='w-3/12' field='packageCapacity' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.packageCapacity')}
						</ThSortable>

						<ThSortable className='w-3/12' field='cost' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.cost')}
						</ThSortable>

						<ThSortable className='w-1/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{packages.getAllSorted(sortingState).map((item, index) => {
						return (
							<tr className='hover' key={index}>
								<td>{index + 1}</td>
								<td className='font-medium truncate'>
									{/* Item name (With link to item details) */}
									<Link to={`/packages/${item.packageId}`} className='border-b border-base-content border-dotted'>
										{item.name}
									</Link>
								</td>
								<td className=''>
									{/* Package Capacity */}
									{displayNumber(item?.packageCapacity, 2)}{' '}
									{t(`units.${item.unit}`, { ns: 'translation', count: Math.round(item?.packageCapacity) })}
								</td>
								<td>
									{/* Cost per item */}
									{displayMoney(item.cost, item.currency)}
									<span className='ml-1 text-xs opacity-50'>{t('labels.costUnit')}</span>
								</td>
								<td>
									<Link to={`/packages/edit/${item.packageId}`}>
										<Button.EditSmall />
									</Link>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
