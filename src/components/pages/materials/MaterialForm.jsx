import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';
import PanelContext from '../../../context/PanelContext';
import FormInput from '../../form/FormInput';
import { useFormHelper } from '../../../hooks/useFormHelper';
import useFormHandler from '../../../hooks/useFormHandler';
import useSchemaMaterials from '../../../hooks/schemas/useSchemaMaterials';

export default function MaterialForm() {
	//Hooks
	const { t } = useTranslation('pages/materials', 'translation');
	const { selectUnitArray, priceWithTax, isMassUnit, selectCurrencyArray } = useFormHelper();

	const schema = useSchemaMaterials();

	//Context
	const { materials } = useContext(DataContext);
	const { close: closePanel } = useContext(PanelContext);

	//Form State
	const [formState, setFormState] = useState({
		materialId: materials.getNextId(),
		name: '',
		unit: 'kg',
		tax: 0,
		price: 0,
		currency: 'TRY',
		density: '1.00',
	});

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
		materials.addMaterial(data);
		console.log(data);
	};

	return (
		<form className='' onSubmit={(e) => onSubmitHandler(e, handleSubmit)}>
			{/* FORM GRID */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 mb-5'>
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
			<div className='border-t pt-3'>
				<button type='submit' className='btn btn-primary mr-2'>
					{t('buttons.save', { ns: 'translation' })}
				</button>
				<button className='btn btn-outline' onClick={() => closePanel(true)}>
					{t('buttons.cancel', { ns: 'translation' })}
				</button>
			</div>
		</form>
	);
}
