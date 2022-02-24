import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';

import FormInput from '../../form/FormInput';
import { useFormHelper } from '../../../hooks/useFormHelper';
import useFormHandler from '../../../hooks/useFormHandler';
import useSchemaMaterials from '../../../hooks/schemas/useSchemaMaterials';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';

export default function MaterialForm({ handleClose = null, loadMaterial = null } = {}) {
	//Hooks
	const { t } = useTranslation('pages/materials', 'translation');
	const { selectUnitArray, priceWithTax, isMassUnit, selectCurrencyArray } = useFormHelper();

	//Form Validation with joi
	const schema = useSchemaMaterials();

	//Context
	const { materials } = useContext(DataContext);

	//New material or existing
	let formInitialState = {};
	//Initial State (New material)
	if (loadMaterial !== null) {
		const materialToLoad = materials.getMaterial(loadMaterial);
		if (materialToLoad) {
			formInitialState = materialToLoad;
			loadMaterial = true; //Set to true for checking if this is edit form
		}
	} else {
		formInitialState = {
			materialId: materials.getNextId(),
			name: '',
			unit: 'kg',
			tax: 0,
			price: 0,
			currency: 'TRY',
			density: '1.00',
		};
	}

	//Form State
	const [formState, setFormState] = useState(formInitialState);

	//Import form handler hook
	const { onChangeHandler, setFieldState, onSubmitHandler, hasError } = useFormHandler({
		formState,
		setFormState,
		schema,
	});

	//Custom form change handle middleware
	const handleChange = (e) => {
		if (e.target.name === 'unit' && isMassUnit(e.target.value) === true) {
			//A weight unit is selected. Reset density
			setFieldState('density', '1.00');
		}
		return onChangeHandler(e);
	};

	const handleSubmit = (data) => {
		//Send form data to material model
		if (materials.addMaterial(data)) {
			//Success

			//Inform
			if (loadMaterial !== null) {
				toast.success(t('form.updateSuccess', { name: data.name }));
			} else {
				toast.success(t('form.addSuccess', { name: data.name }));
			}
		}
		//Close and reset panel
		handleClose();
	};

	const handleDelete = () => {
		if(!loadMaterial) return;
		const result = materials.deleteMaterial(formState.materialId);
		if( result ) {
			//success
			toast.success(t('form.deleteSuccess', { name: result.name }));
		}
		handleClose();
	}

	return (
		<form onSubmit={(e) => onSubmitHandler(e, handleSubmit)}>
			{/* FORM GRID */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2 mb-5 '>
				{/* Material Name */}
				<FormInput label={t('form.name')} altLabel={t('form.nameAlt')} className='col-span-2' error={hasError('name')}>
					<FormInput.Text name='name' value={formState.name} onChange={handleChange} />
				</FormInput>

				{/* Unit price and currency */}
				<FormInput
					label={t('form.price')}
					altLabel={t('form.priceAlt', { amount: priceWithTax(formState.price, formState.tax) })}
					className='col-span-2'
					error={[hasError('price'), hasError('currency')]}
				>
					<FormInput.Group>
						<FormInput.Text name='price' value={formState.price} onChange={handleChange} />
						<FormInput.Select
							name='currency'
							className='select select-bordered w-auto'
							options={selectCurrencyArray(false, true)}
							value={formState.currency}
							onChange={handleChange}
						/>
					</FormInput.Group>
				</FormInput>

				{/* Price Tax */}
				<FormInput label={t('form.tax')} altLabel={t('form.taxAlt')} className='col-span-2' error={hasError('tax')}>
					<FormInput.Number min='0' step='1' name='tax' value={formState.tax} onChange={handleChange} />
				</FormInput>

				{/* Scale Unit  */}
				<FormInput label={t('form.unit')} altLabel={t('form.unitAlt')} error={hasError('unit')}>
					<FormInput.Select name='unit' options={selectUnitArray()} value={formState.unit} onChange={handleChange} />
				</FormInput>

				{/* Density */}
				<FormInput
					label={t('form.density')}
					altLabel={t('form.densityAlt', { interpolation: { escapeValue: false } })}
					error={hasError('density')}
				>
					<FormInput.Number
						step='0.01'
						name='density'
						disabled={isMassUnit(formState.unit)}
						value={formState.density}
						onChange={handleChange}
					/>
				</FormInput>
			</div>

			{/* FORM ACTIONS */}
			<div className='border-t pt-3 flex justify-between'>
				<div>
					<button type='submit' className='btn btn-primary mr-2'>
						{t('buttons.save', { ns: 'translation' })}
					</button>
					<button className='btn btn-outline' onClick={handleClose}>
						{t('buttons.cancel', { ns: 'translation' })}
					</button>
				</div>
				{loadMaterial && (
					<button className='btn btn-error' onClick={handleDelete}>
						<FaTrashAlt className='mr-1' />
						{t('buttons.delete', { ns: 'translation' })}
					</button>
				)}
			</div>
		</form>
	);
}
