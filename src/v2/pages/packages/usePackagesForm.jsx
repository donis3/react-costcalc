import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useApp from '../../context/app/useApp';
import useEndproducts from '../../context/endproducts/useEndproducts';
import usePackages from '../../context/packages/usePackages';
import usePackagesDefaults, { defaultPackage } from '../../context/packages/usePackagesDefaults';
import useFormBuilder from '../../hooks/forms/useFormBuilder';

export default function usePackagesForm({ packageId = null } = {}) {
	const navigate = useNavigate();
	const { t } = useTranslation('translation');
	const { t: endProductsTranslations } = useTranslation('pages/endproducts');

	const packages = usePackages();

	const endProducts = useEndproducts();

	const pack = packageId === null ? null : packages.findById(packageId, true);
	const originalState = pack ? { ...pack } : { ...defaultPackage };

	const { page } = useApp();
	const dispatch = packages.dispatch;

	useEffect(() => {
		//Set page breadcrumb if applicable
		if (pack) {
			page.setBreadcrumb(pack.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//==========================// Form States //===================================//
	//is form submitted
	const [isSubmitted, setSubmitted] = useState(false);
	//==========================// Form Handling Library //===================================//
	const { schema, register, getError, handleChange, getFormData, setValue, getValue, resetForm, setState, formState } =
		useFormBuilder({
			initialState: originalState,
			isSubmitted,
		});
	usePackagesDefaults({ schema });

	//================// Form Handlers //===================//

	const handleSubmit = () => {
		try {
			const data = getFormData(true);
			const dispatchAction = pack ? getUpdateDispatchAction(data) : getAddDispatchAction(data);
			dispatch(dispatchAction);
			navigate('/packages');
		} catch (err) {
			//Form errors.
			console.log('Dispatch error:', err.message);
		}
	};

	const handleDelete = () => {
		if (!pack) return;

		//Before deleting, find endProducts that use this packaging
		if (endProducts && Array.isArray(endProducts.data)) {
			const boundEndProducts = endProducts.data.filter((item) => item.packageId === pack.packageId);
			if (boundEndProducts.length > 0) {
				//Stop dispatch. There are related products
				toast.error(endProductsTranslations('deleteError.package', { count: boundEndProducts.length }));
				return;
			}
		}
		const dispatchAction = getDeleteDispatchAction(formState);
		dispatch(dispatchAction);
		navigate('/packages');
	};

	//================// Dispatch Generators //===================//
	//Submit States
	const getAddDispatchAction = (formData) => {
		return {
			type: 'add',
			payload: formData,
			success: function () {
				toast.success(t('success.add', { name: formData.name }));
			},
			error: function (err) {
				toast.error(t('error.add'));
				console.log(err);
			},
		};
	};
	const getUpdateDispatchAction = (formData) => {
		return {
			type: 'update',
			payload: formData,
			success: function () {
				toast.success(t('success.update', { name: formData.name }));
			},
			error: function (err) {
				toast.error(t('error.update'));
				console.log(err);
			},
		};
	};
	const getDeleteDispatchAction = (formState = null) => {
		return {
			type: 'delete',
			payload: formState.packageId,
			success: function () {
				toast.success(t('success.delete', { name: formState.name }));
			},
			error: function () {
				toast.error(t('error.delete'));
			},
		};
	};

	//================// Package Item Handlers //===================//

	/**
	 * Add a new packaging item to items array of form state
	 * @param {*} newItem
	 * @returns
	 */
	const onAddItem = (newItem = null) => {
		if (!newItem) return;
		setState('items', (state) => ({ ...state, items: [...state.items, newItem] }));
	};

	/**
	 * Remove the packaging item at the given index in the items array of form state
	 * @param {number} index
	 * @returns
	 */
	const onRemoveItem = (index = null) => {
		//Validate index
		index = parseInt(index);
		if (isNaN(index)) return;
		if (!formState.items[index]) return;
		//Set state
		setState('items', (state) => {
			let newItemsArray = [...state.items]; //Copy items
			newItemsArray.splice(index, 1); //Remove at specified index
			return { ...state, items: newItemsArray }; //Send back to state
		});
	};

	return {
		getValue,
		setValue,
		handleChange,
		register,
		getError,
		onAddItem,
		onRemoveItem,
		formState,
		formHandler: {
			onSubmit: handleSubmit,
			onReset: resetForm,
			onDelete: pack ? handleDelete : null,
			setSubmitted: setSubmitted,
		},
	};
} //End of hook
