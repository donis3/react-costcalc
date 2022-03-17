import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePackagesDispatch } from '../../context/MainContext';
import useFormHandler from '../common/useFormHandler';
import useJoi from '../common/useJoi';
import { defaultPackage } from './usePackages';


export default function usePackagesForm({ pack = null } = {}) {
	const navigate = useNavigate();
	const { t } = useTranslation('translation');
	const [formState, setFormState] = useState(defaultPackage);
	const schema = usePackageSchema();
	const { onChangeHandler, hasError, onSubmitHandler, resetForm } = useFormHandler({ formState, setFormState, schema });
	const { dispatch } = usePackagesDispatch();

	const onSubmit = (e) => {
		
		const onSuccess = () => {
			toast.success(t('success.add', { name: formState.name }));
			navigate('/packages');
		};
		const onError = () => {
			toast.success(t('error.add'));
		};
		const errors = onSubmitHandler(e, (formData) => {
			dispatch({
				type: 'add',
				payload: formData,
				onSuccess,
				onError,
			});
		});
		if (errors && errors?.length > 0) {
			console.log('Couldn\'t Add package. Errors:', errors);
		}
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

	return { formState, onChangeHandler, hasError, onSubmit, onAddItem, onRemoveItem, resetForm };
} //End of hook

//=======================================//
//Packages Schema
//=======================================//
function usePackageSchema() {
	const { t } = useTranslation('pages/packages');
	const Joi = useJoi();
	const types = ['liquid', 'solid'];

	const schema = Joi.object({
		packageId: Joi.number().min(0).label(t('labels.packageId')),
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
