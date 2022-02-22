import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';
import PanelContext from '../../../context/PanelContext';
import units from '../../../data/units.json';
import currencies from '../../../data/currencies.json';
import FormItem from './FormItem';
import FormInput from '../../form/FormInput';
import { useFormHelper } from '../../../hooks/useFormHelper';

export default function MaterialForm() {
	//Hooks
	const { t } = useTranslation('pages/materials', 'translation');
	const { selectUnitArray, priceWithTax, isMassUnit, selectCurrencyArray } = useFormHelper();

	//Context
	const { materials } = useContext(DataContext);
	const { close: closePanel } = useContext(PanelContext);

	//Form State
	const [formState, setFormState] = useState({
		materialId: '',
		name: '',
		unit: 'kg',
		tax: 0,
		price: 0,
		currency: '',
		density: '1.00',
	});

	//Form Handlers
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formState);
	};

	return (
		<form className='' onSubmit={handleSubmit}>
			{/* FORM GRID */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 mb-5'>
				{/* Material Name */}
				<FormInput label={t('form.name')} altLabel={t('form.nameAlt')} className='col-span-2'>
					<FormInput.Text name='name'/>
				</FormInput>

				<FormInput
					label={t('form.price')}
					altLabel={t('form.priceAlt', { amount: priceWithTax(formState.price, formState.tax) })}
					className='col-span-2'
				>
					<FormInput.Group>
						<FormInput.Text name='price' placeholder='1.00'/>
						<FormInput.Select
							name='currency'
							className='select select-bordered w-auto'
							options={selectCurrencyArray(false, true)}
						/>
					</FormInput.Group>
				</FormInput>

				<FormInput label={t('form.tax')} altLabel={t('form.taxAlt')} className='col-span-2'>
					<FormInput.Number min="0" step="1" name='tax'/>
				</FormInput>

				<FormInput label={t('form.unit')} altLabel={t('form.unitAlt')}>
					<FormInput.Select name='unit' options={selectUnitArray()} />
				</FormInput>

				<FormInput label={t('form.density')} altLabel={t('form.densityAlt', { interpolation: { escapeValue: false } })}>
					<FormInput.Number step='0.01' name='density' disabled={!isMassUnit(formState.unit)} />
				</FormInput>
			</div>

			{/* FORM ACTIONS */}
			<div className='border-t pt-3'>
				<button type='submit' className='btn btn-primary mr-2'>
					{t('buttons.save', { ns: 'translation' })}
				</button>
				<button type='submit' className='btn btn-outline'>
					{t('buttons.cancel', { ns: 'translation' })}
				</button>
			</div>
		</form>
	);
}
