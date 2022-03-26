import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/common/Button';
import CollapsiblePanel from '../../../components/common/CollapsiblePanel';
import Icon from '../../../components/common/Icon';
import FormInput from '../../../components/form/FormInput';
import useCurrency from '../../../hooks/app/useCurrency';
import useJoi from '../../../hooks/common/useJoi';

const defaultValues = {
	name: '',
	itemPrice: 0,
	itemTax: 0,
	boxCapacity: 0,
};

export default function AddPackageItem({ onAddItem = null } = {}) {
	const { t } = useTranslation('pages/packages', 'translation');
	const { currencies } = useCurrency();
	const [componentState, setComponentState] = useState({ packageType: null, errors: {} });
	const formRef = useRef({});
	//Use this on any input element to add it as ref in formRef obj
	const setRef = (element) => {
		const inputName = element?.getAttribute('name');
		if (!inputName) return;
		formRef.current[inputName] = element;
	};

	//create validation schema
	const Joi = useJoi();
	const schema = Joi.object({
		name: Joi.string().min(3).max(100).required().label(t('labels.itemName')),
		packageType: Joi.string().valid('container', 'box', 'other').label(t('labels.packageType')),
		itemPrice: Joi.number().min(0).precision(2).required().label(t('labels.itemPrice')),
		itemTax: Joi.number().min(0).precision(2).required().label(t('labels.itemTax')),
		itemCurrency: Joi.string()
			.valid(...currencies.allCurrencies)
			.label(t('labels.itemCurrency')),
		boxCapacity: Joi.number().min(1).precision(2).label(t('labels.boxCapacity')),
	});

	const itemTypes = [
		{ name: t('packageTypes.container', { ns: 'translation' }), value: 'container' },
		{ name: t('packageTypes.box', { ns: 'translation' }), value: 'box' },
		{ name: t('packageTypes.other', { ns: 'translation' }), value: 'other' },
	];

	//Get initial state
	useEffect(() => {
		if ('packageType' in formRef.current === false) return;
		if (formRef.current.packageType.value !== componentState.packageType) {
			setComponentState((state) => ({ ...state, packageType: formRef.current.packageType.value }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAddItem = () => {
		const [formData, err] = parseRef(formRef, schema);

		if (err) {
			setComponentState((state) => ({ ...state, errors: err }));
			return;
		}
		//Remove box capacity data if package type is not box
		if (componentState.packageType !== 'box') {
			delete formData.boxCapacity;
		}

		//Reset form
		setComponentState((state) => ({ ...state, errors: {} }));

		//Reset fields to their defaults
		Object.keys(formRef.current).forEach((key) => {
			if (key in defaultValues) {
				formRef.current[key].value = defaultValues[key];
			}
		});
		//Ready to add
		onAddItem?.(formData);
	};

	const hasError = (field = null) => {
		if (!field || field in componentState.errors === false) return null;
		return componentState.errors[field];
	};

	return (
		<>
			<CollapsiblePanel
				background='bg-base-200'
				className='mt-10 border rounded-md'
				collapsed={true}
				header={
					<h3 className='font-medium text-base flex items-center gap-x-2'>
						{t('form.addItemTitle')}
						<Icon icon={'FaPlusCircle'} className='text-green-700' />
					</h3>
				}
			>
				<div className='grid grid-cols-12 p-3 gap-y-3 gap-x-3 border-t'>
					{/* row 1 */}
					<FormInput label={t('labels.itemName')} error={hasError('name')} className='col-span-8 col-end-9'>
						<FormInput.Text name='name' reference={setRef} defaultValue={defaultValues.name} />
					</FormInput>

					<FormInput label={t('labels.itemType')} error={hasError('packageType')} className='col-span-4 col-end-13'>
						<FormInput.Select
							name='packageType'
							options={itemTypes}
							reference={setRef}
							onChange={(e) => setComponentState((state) => ({ ...state, packageType: e.target.value }))}
						/>
					</FormInput>

					{/* row 2 */}
					<FormInput label={t('labels.itemPrice')} error={hasError('itemPrice')} className='col-span-4 col-end-5'>
						<FormInput.Text
							name='itemPrice'
							filter='number'
							reference={setRef}
							defaultValue={defaultValues.itemPrice}
						/>
					</FormInput>
					<FormInput label={t('labels.itemTax')} error={hasError('itemTax')} className='col-span-4 col-end-9'>
						<FormInput.Text name='itemTax' filter='number' reference={setRef} defaultValue={defaultValues.itemTax} />
					</FormInput>
					<FormInput
						label={t('labels.itemCurrency')}
						error={hasError('itemCurrency')}
						className='col-span-4 col-end-13'
					>
						<FormInput.Select name='itemCurrency' options={currencies.getCurrencySelectArray()} reference={setRef} />
					</FormInput>

					{componentState.packageType === 'box' && (
						<FormInput
							label={t('labels.boxCapacity')}
							error={hasError('boxCapacity')}
							altLabel={t('labels.boxCapacityAlt')}
							className='col-span-4 col-end-5'
						>
							<FormInput.Text
								name='boxCapacity'
								filter='number'
								reference={setRef}
								defaultValue={defaultValues.boxCapacity}
							/>
						</FormInput>
					)}
					<div className='col-span-full flex justify-center items-center'>
						<Button.Add className='btn btn-block' type='button' onClick={handleAddItem}>
							<Icon icon='FaArrowCircleUp' className='mr-1' /> {t('form.addItem')}
						</Button.Add>
					</div>
				</div>
			</CollapsiblePanel>
		</>
	);
}

const parseRef = (formRef, schema = null) => {
	if (!schema) return;
	const formData = {};
	Object.keys(formRef.current).forEach((name) => {
		const value = formRef.current[name].value;
		formData[name] = value;
	});
	//Remove box capacity
	if (formData?.packageType !== 'box') {
		delete formData.boxCapacity;
	}
	const { error, value } = schema.validate(formData);
	let errors = {};
	if (error && error.details && error.details.length > 0) {
		error.details.forEach((item) => {
			const key = item.context.key;
			if (key in formRef.current && formRef.current[key]) {
				errors[key] = item.message;
			}
		});
	}
	if (Object.keys(errors).length === 0) errors = null;

	return [value, errors];
};
