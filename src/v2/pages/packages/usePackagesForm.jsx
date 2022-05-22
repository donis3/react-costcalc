import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useApp from '../../context/app/useApp';
import useEndproducts from '../../context/endproducts/useEndproducts';
import usePackages from '../../context/packages/usePackages';
import usePackagesDefaults from '../../context/packages/usePackagesDefaults';
import useFormHandler from '../../hooks/common/useFormHandler';

export default function usePackagesForm({ packageId = null } = {}) {
	const navigate = useNavigate();
	const { t } = useTranslation('translation');
	const { t: endProductsTranslations } = useTranslation('pages/endproducts');

	const packages = usePackages();
	const { schema, defaultPackage } = usePackagesDefaults();
	const { endProducts } = useEndproducts();

	const pack = packageId === null ? null : packages.findById(packageId, true);
	const originalState = pack ? { ...pack } : { ...defaultPackage };

	const { page } = useApp();

	const [formState, setFormState] = useState(originalState);

	const { onChangeHandler, hasError, onSubmitHandler } = useFormHandler({ formState, setFormState, schema });
	const dispatch = packages.dispatch;

	useEffect(() => {
		//Set page breadcrumb if applicable
		if (pack) {
			page.setBreadcrumb(pack.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = (e) => {
		const errors = onSubmitHandler(e, (formData) => {
			const dispatchAction = pack ? getUpdateDispatchAction(formData) : getAddDispatchAction(formData);
			dispatch(dispatchAction);
			navigate('/packages');
		});
		if (errors && errors?.length > 0) {
			console.log('Dispatch error:', errors);
		}
	};

	const onDelete = () => {
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

	//Submit States
	const getAddDispatchAction = (formData) => {
		return {
			type: 'add',
			payload: formData,
			success: function () {
				toast.success(t('success.add', { name: formState.name }));
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
				toast.success(t('success.update', { name: formState.name }));
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
