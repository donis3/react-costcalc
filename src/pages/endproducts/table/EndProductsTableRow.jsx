import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import useIntl from '../../../hooks/common/useIntl';

export default function EndProductsTableRow({ data = null } = {}) {
	const { displayMoney } = useIntl();

	//console.log(data)
	if (!data) return <></>;
	let linkClass = 'border-b border-dotted border-base-content';

	return (
		<tr>
			<td className='whitespace-pre-wrap'>
				{/* Product Name */}
				<Link to={`/endproducts/${data.endId}`} className={linkClass}>
					{data.name}
				</Link>
			</td>
			<td>
				{/* Recipe */}
				<Link to={`/recipes/${data.recipeId}`} className={linkClass}>
					{data.recipeName}
				</Link>
			</td>
			<td>
				{/* Package */}
				<Link to={`/packages/${data.packageId}`} className={linkClass}>
					{data.packageName}
				</Link>
			</td>
			<td>
				{/* Cost */}
				{displayMoney(data.getCost(true))}
			</td>
			<td>
				<Link to={`/endproducts/edit/${data.endId}`}>
					<Button.EditSmall />
				</Link>
			</td>
		</tr>
	);
}
