import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../../../components/common/ProgressBar';
import Form from '../../../components/forms/Form';
import { useMaterialContext } from '../../../context/MainContext';
import useConfig from '../../../hooks/app/useConfig';
import useIntl from '../../../hooks/common/useIntl';
import useDefaultButtons from '../../../hooks/forms/useDefaultButtons';

export default function ContentTable({ controls, recipeMaterials, recipeYield }) {
	const { displayNumber } = useIntl();
	const config = useConfig();
	const { AddItem } = useDefaultButtons();
	const { t } = useTranslation('pages/recipes');
	const { Materials } = useMaterialContext();
	const materials = Materials?.getAll();
	const selectedMaterial = materials ? materials[0] : null;
	const unit = config.getUnitType(selectedMaterial.unit) === 'volume' ? 'L' : 'kg';

	const recipeWeight = totalWeight(recipeMaterials);
	const initialUiState = {
		material: selectedMaterial,
		unit: unit,
	};

	const [error, setError] = useState({ materialId: '', amount: '' });
	const [uiState, setUiState] = useState(initialUiState);
	const amountRef = useRef();
	const materialRef = useRef();

	if (!Array.isArray(materials) || materials.length === 0) return <ContentTableError />;
	if (!controls || !controls.add) return <ContentTableError />;
	const { add, remove } = controls;

	function totalWeight(mats) {
		if (!Array.isArray(mats)) return 0;
		return mats.reduce((total, recipeMat) => {
			let weight = 0;
			if (config.isLiquid(recipeMat.unit)) {
				//Find density of this mat
				const { density } = materials.find((item) => item.materialId === recipeMat.materialId) || {};
				if (density) {
					weight = recipeMat.amount * density;
				}
			} else {
				weight = recipeMat.amount;
			}
			return total + parseFloat(weight);
		}, 0);
	}

	function getPercent(fraction, total) {
		fraction = isNaN(parseFloat(fraction)) ? 0 : parseFloat(fraction);
		total = isNaN(parseFloat(total)) ? 0 : parseFloat(total);
		if (total === 0 || fraction === 0) return 0;
		if (fraction >= total) return 100;

		return Math.round((fraction / total) * 100);
	}

	const getCurrentMaterial = () => {
		const materialId = parseInt(materialRef.current?.value);
		if (isNaN(materialId)) return null;
		const selected = materials.find((item) => item.materialId === materialId);
		return selected;
	};

	const getCurrentAmount = () => {
		const amount = parseFloat(amountRef.current?.value);
		return isNaN(amount) ? 0 : amount;
	};

	const resetForm = () => {
		amountRef.current.value = '0';
		//materialRef.current.value = selectedMaterial?.materialId;
		setError({ materialId: '', amount: '' });
		setUiState(initialUiState);
	};

	const handleAdd = () => {
		const { material, ...data } = validate();
		if (!material || !data) return;
		resetForm();
		add(data);
	};

	const validate = () => {
		const material = getCurrentMaterial();
		const amount = getCurrentAmount();
		const materialUnit = config.isLiquid(material?.unit) ? 'L' : 'kg';
		//Handle Errors
		setError(() => {
			return {
				materialId: material ? '' : t('contentForm.invalidMaterial'),
				amount: amount > 0 ? '' : t('contentForm.invalidAmount'),
			};
		});

		//Set ui state
		if (material) {
			setUiState((state) => {
				return {
					...state,
					material,
					unit: materialUnit,
				};
			});
		}
		//Dont return data if erroneous
		if (!material || amount <= 0) {
			return {};
		}

		return { material: material, materialId: material.materialId, amount: amount, unit: materialUnit };
	};

	//=============================// Render Form //=======================//
	return (
		<div>
			{/* Table of Materials in the recipe */}
			<table className='w-full table table-zebra table-compact'>
				<thead>
					<tr>
						<th className='w-6/12'>{t('labels.material')}</th>
						<th className='w-4/12'>{t('labels.amount')}</th>
						<th className='w-2/12'></th>
					</tr>
				</thead>
				<tbody>
					{recipeMaterials.map((item, i) => {
						const mat = Materials.findById(item.materialId);
						return (
							<ContentRow
								material={mat}
								amount={item.amount}
								unit={item.unit}
								key={i}
								remove={() => remove(item.materialId)}
							/>
						);
					})}
				</tbody>
			</table>

			{/* Progress bar of material weight / total recipe yield */}
			<div className='w-full flex flex-col'>
				<div className='col-span-full py-3'>
					<ProgressBar percentage={getPercent(recipeWeight, recipeYield)} colorize />
				</div>
				<div className='w-full flex justify-end text-sm opacity-70'>
					{/* Recipe Capacity Stats */}
					{t('form.contentStats', { amount: displayNumber(recipeWeight, 2), max: displayNumber(recipeYield, 2) })}
				</div>
			</div>

			{/* Add new material row */}
			<h3 className='mt-10 font-medium text-lg'>{t('contentForm.addMaterial')}</h3>
			<div className='w-full grid grid-cols-6 gap-x-3 mt-1 mb-10'>
				<Form.Control noLabel error={error.materialId} className='col-span-3'>
					<Form.Select name='materialId' onChange={validate} ref={materialRef} options={Materials.getSelectOptions()} />
				</Form.Control>
				<Form.ControlGroup error={error.amount} noLabel className='col-span-2'>
					<Form.Number name='amount' defaultValue={0} ref={amountRef} onChange={validate} />
					<span>{uiState.unit}</span>
				</Form.ControlGroup>
				<AddItem onClick={handleAdd} />
			</div>
		</div>
	);
}

ContentTable.defaultProps = {
	controls: null,
	materials: null,
};
//=========================// Extra Components //==================================//
/**
 * Error to display if no materials are found
 * @returns
 */
function ContentTableError() {
	const { t } = useTranslation('pages/recipes');
	return (
		<div className='min-h-[200px]'>
			<p className='text-red-600 p-3 bg-red-100 rounded-lg'>{t('form.noMaterials')}</p>
		</div>
	);
}

function ContentRow({ material, amount, unit, remove } = {}) {
	const { RemoveItem } = useDefaultButtons();
	const { displayNumber } = useIntl();
	if (!material) return <></>;

	return (
		<tr>
			<td>{material.name}</td>
			<td>
				{displayNumber(amount, 2)} {unit}
			</td>
			<td className='flex justify-center'>{typeof remove === 'function' && <RemoveItem onClick={remove} />}</td>
		</tr>
	);
}
