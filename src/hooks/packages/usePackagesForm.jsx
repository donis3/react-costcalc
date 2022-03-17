import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFormHandler from '../common/useFormHandler';
import useJoi from '../common/useJoi';

const defaultState = {
	name: '',
	productType: 'liquid',
	packageCapacity: 0,
	notes: '',
	items: [],
};

export default function usePackagesForm({ pack = null } = {}) {
	const [formState, setFormState] = useState(defaultState);
	const schema = usePackageSchema();
	const { onChangeHandler, hasError, onSubmitHandler } = useFormHandler({ formState, setFormState, schema });

	const onSubmit = (e) => {
		onSubmitHandler(e, (formData) => {
			console.log('Submitting Data');
			console.table(formData);
			return;
		});
	};

	const onResetForm = () => {
		setFormState((state) => defaultState);
	};

	const onAddItem = (newItem = null) => {
		if (!newItem) return;
		setFormState((state) => ({ ...state, items: [...state.items, newItem] }));
	};

	const onRemoveItem = (index = null) => {
		//Validate index
		index = parseInt(index);
		if (isNaN(index)) return;
		if (!formState.items[index]) return;
		//Set state
		setFormState((state) => {
			let newItemsArray = state.items;
			newItemsArray.splice(index, 1);
			return { ...state, items: newItemsArray };
		});
	};

	return { formState, onChangeHandler, hasError, onSubmit, onAddItem, onRemoveItem, onResetForm };
} //End of hook

//=======================================//
//Packages Schema
//=======================================//
function usePackageSchema() {
	const { t } = useTranslation('pages/packages');
	const Joi = useJoi();
	const types = ['liquid', 'solid'];

	const schema = Joi.object({
		packageId: Joi.number().min(0).required().label(t('labels.packageId')),
		name: Joi.string().min(3).max(100).required().label(t('labels.name')),
		productType: Joi.string()
			.min(0)
			.max(100)
			.required()
			.valid(...types)
			.label(t('labels.productType')),
		packageCapacity: Joi.number().positive().precision(2).required().label(t('labels.packageCapacity')),
		notes: Joi.string().min(0).max(500).label(t('labels.notes')),
		items: Joi.array().label(t('labels.item')),
	});

	return schema;
}
