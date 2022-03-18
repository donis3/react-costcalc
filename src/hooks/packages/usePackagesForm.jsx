import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usePackagesContext, usePackagesDispatch } from '../../context/MainContext';
import useFormHandler from '../common/useFormHandler';
import useJoi from '../common/useJoi';
import { defaultPackage } from './usePackages';

export default function usePackagesForm({ packageId = null } = {}) {
	const navigate = useNavigate();
	const { t } = useTranslation('translation');
	const { packages } = usePackagesContext();
	const pack = packageId === null ? null : packages.findById(packageId, true);
	const originalState = pack ? { ...pack } : { ...defaultPackage };

	const [formState, setFormState] = useState(originalState);
	const schema = usePackageSchema();
	const { onChangeHandler, hasError, onSubmitHandler } = useFormHandler({ formState, setFormState, schema });
	const { dispatch } = usePackagesDispatch();

	const onSubmit = (e) => {
		const errors = onSubmitHandler(e, (formData) => {
			const dispatchAction = pack ? getUpdateDispatchAction(formData) : getAddDispatchAction(formData);
			dispatch(dispatchAction);
		});
		if (errors && errors?.length > 0) {
			console.log('Dispatch error:', errors);
		}
	};

	const onDelete = () => {
		if(!pack) return;
		const dispatchAction = getDeleteDispatchAction(formState);
		dispatch(dispatchAction);
	}

	//Submit States
	const getAddDispatchAction = (formData) => {
		return {
			type: 'add',
			payload: formData,
			onSuccess: function () {
				toast.success(t('success.add', { name: formState.name }));
				navigate('/packages');
			},
			onError: function () {
				toast.error(t('error.add'));
			},
		};
	};
	const getUpdateDispatchAction = (formData) => {
		return {
			type: 'update',
			payload: formData,
			onSuccess: function () {
				toast.success(t('success.update', { name: formState.name }));
				navigate('/packages');
			},
			onError: function () {
				toast.error(t('error.update'));
			},
		};
	};
	const getDeleteDispatchAction = (formState = null) => {
		return {
			type: 'delete',
			payload: formState.packageId,
			onSuccess: function () {
				toast.success(t('success.delete', { name: formState.name }));
				navigate('/packages');
			},
			onError: function () {
				toast.error(t('error.delete'));
			},
		};
	};

	//Event Handlers
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
			let newItemsArray = [...state.items]; //Copy items
			newItemsArray.splice(index, 1); //Remove at specified index
			return { ...state, items: newItemsArray }; //Send back to state
		});
	};

	const resetForm = () => {
		setFormState((state) => ({ ...originalState }));
	};

	return { formState, onChangeHandler, hasError, onSubmit, onAddItem, onRemoveItem, resetForm, onDelete };
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
