import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataContext from '../../../context/DataContext';
import PanelContext from '../../../context/PanelContext';
import units from '../../../data/units.json';
import currencies from '../../../data/currencies.json';
import FormItem from './FormItem';

export default function MaterialForm() {
	const { t } = useTranslation('pages/materials', 'translation');

	const { materials } = useContext(DataContext);
	const { close: closePanel } = useContext(PanelContext);

	const [formState, setFormState] = useState({
		materialId: '',
		name: '',
		unit: 'kg',
		tax: 0,
		price: 0,
		currency: '',
		density: '1.00',
	});

	const [formErrors, setFormErrors] = useState({});

	//On Input Change, set form state
	const changeFormState = (e) => {
		if (e.target.name in formState === false) {
			//This field doesn't exist in form allowed fields
			console.warn(`${e.target.name} is invalid`);
			return;
		}
		const currentFieldName = e.target.name;

		const newData = {
			[currentFieldName]: e.target.value,
		};

		//Special Cases & Validation
		switch (currentFieldName) {
			case 'density': {
				newData[currentFieldName] = filterNumeric(newData[currentFieldName]);
				break;
			}
			case 'unit': {
				//Reset density to 1 if this is a mass unit
				if (isMassUnit(newData[currentFieldName])) {
					newData.density = '1.00';
				}
				break;
			}
			case 'name': {
				newData[currentFieldName] = newData[currentFieldName].trim();
				if (newData[currentFieldName].length < 2) {
					addFieldError(currentFieldName, t('form.minLength', { ns: 'translation', count: 2 }));
				} else {
					removeFieldError(currentFieldName);
				}
				break;
			}
			default:
				break;
		}

		setFormState((currentState) => {
			return {
				...currentState,
				...newData,
			};
		});
	};

	//Handle form submit
	const handleSubmit = (e) => {
		e.preventDefault();
		if (Object.keys(formErrors).length > 0) {
			//Have errors
			return;
		}

		materials.add(formState);
		closePanel();
	};

	//Get error text if available for a field
	const getFieldError = (fieldName) => {
		if (fieldName in formErrors) return formErrors[fieldName];
	};

	const addFieldError = (fieldName, message) => {
		setFormErrors((currentErrors) => {
			return {
				...currentErrors,
				[fieldName]: message,
			};
		});
	};
	const removeFieldError = (fieldName) => {
		setFormErrors((currentErrors) => {
			delete currentErrors[fieldName];
			return currentErrors;
		});
	};

	return (
		<form className='' onSubmit={handleSubmit}>
			{/* FORM GRID */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 mb-5'>
				{/* Material Name */}
				<FormItem label={t('form.name')} altLabel={t('form.nameAlt')} error={getFieldError('name')} colSpan='2'>
					<input
						type='text'
						className='input input-bordered'
						name='name'
						value={formState.name}
						onChange={changeFormState}
					/>
				</FormItem>

				{/* Material Unit Ex: kg */}
				<FormItem label={t('form.unit')} altLabel={t('form.unitAlt')} error={getFieldError('unit')} colSpan='1'>
					<select
						className='select w-full max-w-xs select-bordered'
						name='unit'
						value={formState.unit}
						onChange={changeFormState}
					>
						<option disabled>{'--- ' + t('form.massUnits') + ' ---'}</option>
						{units &&
							units.mass &&
							units.mass.map((unitItem) => {
								return (
									<option value={unitItem.name} key={unitItem.name}>
										{t('units.' + unitItem.name, { ns: 'translation', count: 1 })}
										{` (${unitItem.name})`}
									</option>
								);
							})}
						<option disabled>{'--- ' + t('form.volumeUnits') + ' ---'}</option>
						{units &&
							units.volume &&
							units.volume.map((unitItem) => {
								return (
									<option value={unitItem.name} key={unitItem.name}>
										{t('units.' + unitItem.name, { ns: 'translation', count: 1 })}
										{` (${unitItem.name})`}
									</option>
								);
							})}
					</select>
				</FormItem>
				{/* Material Density Input (Will be disabled when mass unit is selected) */}
				<FormItem
					label={t('form.density')}
					altLabel={t('form.densityAlt', { interpolation: { escapeValue: false } })}
					error={getFieldError('density')}
					colSpan='1'
				>
					<input
						type='number'
						step='0.01'
						min='0.01'
						className='input input-bordered'
						name='density'
						value={formState.density}
						onChange={changeFormState}
						disabled={isMassUnit(formState.unit) ? true : false}
					/>
				</FormItem>
				{/*  Material Price */}
				<FormItem
					label={t('form.price')}
					altLabel={t('form.priceAlt', { amount: priceWithTax(formState.price, formState.tax) })}
					error={getFieldError('price')}
					colSpan='1'
				>
					<input
						type='number'
						step='0.01'
						min='0.01'
						className='input input-bordered'
						name='price'
						value={formState.price}
						onChange={changeFormState}
					/>
				</FormItem>
				{/* Currency */}
				<FormItem
					label={t('form.currency')}
					altLabel={t('form.currencyAlt')}
					error={getFieldError('currency')}
					colSpan='1'
				>
					<select
						className='select w-full max-w-xs select-bordered'
						name='currency'
						value={formState.currency}
						onChange={changeFormState}
					>
						{currencies &&
							currencies.map((currencyItem) => {
								return (
									<option value={currencyItem.code} key={currencyItem.code}>
										{t('currency.' + currencyItem.code, {ns: 'translation'})}
										{` (${currencyItem.symbol})`}
									</option>
								);
							})}
					</select>
				</FormItem>
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

const filterNumeric = (val) => {
	//const reg = /[^0-9\.\,]/g;
	const filter = /[^\d*\.,]+/g;
	const regex = /^\d+(\.\d{1,2})?$/g;
	let result = 1;

	if (regex.test(val) === true) {
		//Valid decimal number
		result = parseFloat(val);
	} else {
		result = parseFloat(val.replace(filter, ''));
	}
	if (isNaN(result)) {
		return 1;
	} else {
		return result;
	}
};

const priceWithTax = (price, tax) => {
	tax = parseFloat(tax);
	price = parseFloat(price);
	if (isNaN(price) || isNaN(tax)) {
		//console.warn('Price Calculation: Invalid price or tax percentage supplied');
		return '';
	}

	return price + price * (tax / 100);
};

const isMassUnit = (unitName) => {
	if (units.mass.find((item) => item.name === unitName)) {
		return true;
	}
	return false;
};
