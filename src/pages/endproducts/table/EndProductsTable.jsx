import React from 'react';
import { useTranslation } from 'react-i18next';
import ThSortable from '../../../components/common/ThSortable';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useIntl from '../../../hooks/common/useIntl';

export default function EndProductsTable() {
	const { t } = useTranslation('pages/endproducts', 'translation');
	const [sortingState, sortBy] = useSortTableByField('endproducts', ['name', 'product', 'package', 'cost'], 'name');
	const { displayNumber, displayMoney } = useIntl();

	//No package
	if (0) {
		return <div className='mt-10 opacity-50'>{t('endproducts.noPackage')}</div>;
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

						<ThSortable className='w-3/12' field='product' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.product', { ns: 'translation' })}
						</ThSortable>

						<ThSortable className='w-3/12' field='package' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.package', { ns: 'translation' })}
						</ThSortable>

                        <ThSortable className='w-2/12' field='cost' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.cost', { ns: 'translation' })}
						</ThSortable>

						<ThSortable className='w-1/12'></ThSortable>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	);
}
