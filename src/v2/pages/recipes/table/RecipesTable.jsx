import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ThSortable from '../../../components/common/ThSortable';
import TablePagination from '../../../components/tables/TablePagination';
import useRecipes from '../../../context/recipes/useRecipes';
import useSortTableByField from '../../../hooks/app/useSortTableByField';
import useIntl from '../../../hooks/common/useIntl';
import usePagination from '../../../hooks/common/usePagination';

export default function RecipesTable() {
	const { t } = useTranslation('pages/recipes');
	const [sortingState, sortBy] = useSortTableByField('recipes', ['name', 'yield', 'product'], 'name');
	const { recipes } = useRecipes();
	const { displayNumber } = useIntl();

	const { rows, currentPage, onPageChange, totalPages, count } = usePagination({
		table: recipes.getAllSorted(sortingState),
		name: 'Recipes',
	});

	//Products table is empty
	if (recipes.count() === 0) {
		return <div className='mt-10 opacity-50'>{t('recipes.noRecipes')}</div>;
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
					{rows.map((item, index) => {
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
			<TablePagination current={currentPage} total={totalPages} handler={onPageChange} itemCount={count} />
		</div>
	);
}
