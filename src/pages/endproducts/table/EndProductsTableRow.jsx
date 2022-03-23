import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import useIntl from '../../../hooks/common/useIntl';

export default function EndProductsTableRow({ data = null } = {}) {
	const { displayMoney } = useIntl();
	const { t } = useTranslation('pages/endproducts');

	//console.log(data)
	if (!data) data = { name: 'Test', recipeId: 1, packageId: 1 };

	return (
		<tr>
			<td className='whitespace-pre-wrap'>
				{/* Product Name */}
				{data.name}
			</td>
			<td>
				{/* Recipe */}
				{data.recipeName}
			</td>
			<td>
				{/* Package */}
				{data.packageName}
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
