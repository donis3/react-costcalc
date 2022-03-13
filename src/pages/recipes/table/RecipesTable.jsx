import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ThSortable from '../../../components/common/ThSortable';
import { useRecipesContext } from '../../../context/MainContext';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useIntl from '../../../hooks/common/useIntl';

export default function RecipesTable({ handleOpen = null } = {}) {
	const { t } = useTranslation('pages/recipes');
	const [sortingState, sortBy] = useSortTableByField('recipes', ['name', 'yield', 'product'], 'name');
	const { recipes } = useRecipesContext();
	const { displayNumber } = useIntl();

	//Products table is empty
	if (recipes.count() === 0) {
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

						<ThSortable className='w-4/12' field='name' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.name')}
						</ThSortable>

						<ThSortable className='w-4/12' field='product' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.product')}
						</ThSortable>

						<ThSortable className='w-2/12' field='yield' sortingState={sortingState} handleSort={sortBy}>
							{t('labels.yield')}
						</ThSortable>

						<ThSortable className='w-1/12'></ThSortable>
					</tr>
				</thead>
				<tbody>
					{recipes.getAllSorted(sortingState).map((item, index) => {
						return (
							<tr className='hover' key={index}>
								<td>{index + 1}</td>
								<td className='font-medium'>
									<Link to={`/recipes/${item.recipeId}`} className='border-b border-base-content border-dotted'>
										{item.name}
									</Link>
								</td>
								<td>{item?.product}</td>
								{/* Show yield weight if item is liquid */}
								<td title={item.isLiquid ? `${displayNumber(item.yieldWeight)} kg` : null}>
									{displayNumber(item.yield, 2)} {item?.unit}
								</td>
								<td>
									<Link to={`/recipes/edit/${item.recipeId}`}>
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
