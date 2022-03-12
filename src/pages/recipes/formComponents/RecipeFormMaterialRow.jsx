import { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from '../../../components/form/FormInput';
import useConfig from '../../../hooks/app/useConfig';
import useJoi from '../../../hooks/common/useJoi';
import {FaPlus as PlusIcon} from 'react-icons/fa'

export default function RecipeFormMaterialRow({ materials = null, addMaterial = null }) {
	const newMaterialState = (materialId = null) => {
		if (materialId === null) return;
		const data = materials.findById(materialId);
		if (!data) return;

		const materialState = {
			materialId: materialId,
			name: data.name,
			isLiquid: config.isLiquid(data.unit),
			unit: config.getBaseUnit(data.unit),
			density: parseFloat(data.density),
			amount: 0,
			error: null,
		};
		return materialState;
	};
	const defaultMaterial = () => {
		return newMaterialState(materials.getDefaultSelectId(), 0);
	};
	const config = useConfig();
	const [mat, setMat] = useState(defaultMaterial);
	const { t } = useTranslation('translation');
	const Joi = useJoi();
	const schema = Joi.number().min(0.01).required().label(t('fields.amount'));

	//Load new selected material
	useEffect(() => {
		if (isNaN(parseInt(mat.materialId))) return;
		const newState = newMaterialState(mat.materialId, mat.amount);
		setMat(newState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mat.materialId]);

	//Handle form change
	const onChangeHandler = (e) => {
		const { value, name } = e.target;
		if (name === 'materialId' && isNaN(parseInt(value)) === false) {
			setMat((state) => ({ ...state, materialId: parseInt(value) }));
		}
		if (name === 'amount') {
			setMat((state) => ({ ...state, amount: value }));
		}
	};

	const validate = () => {
		const { error } = schema.validate(mat.amount);
		if (error && Array.isArray(error.details) && error.details.length > 0) {
			setMat((state) => ({ ...state, error: error.details[0].message }));
			return false;
		} else {
			setMat((state) => ({ ...state, error: null }));
			return true;
		}
	};

	const handleSubmit = () => {
		//If form not valid return
		if (!validate()) return;
		//copy state
		const data = { ...mat };
		//Send the new material to parent form
		addMaterial(data);
		//Reset form
		setMat(defaultMaterial());
	};

	if (!materials) return <></>;
	return (
		<div className='grid grid-cols-6 items-end gap-x-5 mt-10'>
			<FormInput label={t('fields.name')} className='col-span-3'>
				<FormInput.Select
					name='materialId'
					value={mat.materialId}
					onChange={onChangeHandler}
					options={materials.getSelectOptions()}
				/>
			</FormInput>

			<FormInput label={t('fields.amount')} className='col-span-2'>
				<FormInput.Group>
					<FormInput.Text name='amount' value={mat.amount} onChange={onChangeHandler} filter='number' />
					<span>{mat.unit}</span>
				</FormInput.Group>
			</FormInput>
			<FormInput className='col-span-1'>
				<button type='button' className='btn btn-secondary ' onClick={handleSubmit}>
					<PlusIcon className='text-md mr-1' /> {t('buttons.add')}
				</button>
			</FormInput>
			{mat.error && <div className='col-span-6 text-error-content text-xs mt-1'>{mat.error}</div>}
		</div>
	);
}
