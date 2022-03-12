import React from 'react';
import { useTranslation } from 'react-i18next';
import useIntl from '../../../hooks/common/useIntl';
import { FaTimes as CloseIcon } from 'react-icons/fa';

/**
 * Component for each material added to recipe form.
 * @param {object} material Material data found by materials.findById
 * @param {float} amount amount added to recipe
 * @param {string} unit base unit kg / L
 * @param {function} handleDelete will be called handleDelete(materialId) for removing item from recipe
 */
export default function RecipeFormMaterialItem({ material, amount, unit, handleDelete, index }) {
	const { t } = useTranslation('translation');
	const { displayNumber } = useIntl();
	if (!material) return <span className='col-span-6 text-error-content p-1'>{t('error.invalidItem')}</span>;
	let amountTitle = null;

	if (material.isLiquid) {
		amountTitle = displayNumber(amount * material.density, 2) + ' kg';
	}
	const rowColor = index % 2 === 0 ? '' : 'bg-slate-100';

	return (
		<>
			{/*  */}
			<span className={'col-span-3 p-1 pr-3 ' + rowColor}>{material.name}</span>
			<span className={'col-span-2 p-1 pr-3 ' + rowColor} title={amountTitle}>{`${displayNumber(amount, 2)} ${unit}`}</span>
			<span className={'col-span-1 p-1 flex items-center justify-center ' + rowColor}>
				<button
					className='btn btn-ghost btn-outline btn-xs text-error-content text-md'
					onClick={() => handleDelete(material.materialId)}
				>
					<CloseIcon />
				</button>
			</span>
		</>
	);
}

RecipeFormMaterialItem.defaultProps = {
	material: null,
	amount: 0,
	unit: 'kg',
	index: 0,
	handleDelete: () => {},
};
