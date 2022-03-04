import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useProductDispatchContext, useProductsContext } from '../../context/MainContext';
import useFormHandler from '../common/useFormHandler';
import useSchemaProducts from './useSchemaProducts';

export default function useProductsForm({ productId = null, handleClose = null }) {
	const { t } = useTranslation('pages/products');
	const { products } = useProductsContext();
	const { dispatch } = useProductDispatchContext();
	const product = products.findById(productId);

	const formInitialState = products.generateFormInitialState({ productId, name: t('form.defaultName') });
	const [formState, setFormState] = useState(formInitialState);
	const { schema } = useSchemaProducts();
	const formHandler = useFormHandler({ formState, setFormState, schema });

	//Custom Form Submit Handler
	const handleSubmit = (data) => {
		if (!product) {
			//Handle Add New Product
			const onSuccess = () => {
				toast.success(t('form.addSuccess', { name: data.name }));
				handleClose?.();
			};
			const onError = () => {
				toast.error(t('form.addError'));
			};

			dispatch({ type: 'add', payload: data, success: onSuccess, error: onError });
		} else {
			//Handle Update Product
			const onSuccess = () => {
				toast.success(t('form.editSuccess', { name: data.name }));
				handleClose?.();
			};
			const onError = () => {
				toast.error(t('form.editError', { name: data.name }));
			};

			dispatch({ type: 'update', payload: data, success: onSuccess, error: onError });
		}
	};
	//Custom change handler
	const handleChange = (e) => {
		//Override isLiquid change handler to manual
		if (e.target.name === 'isLiquid') {
			//Change density to 1 if its a solid
			if (e.target.value === 'false') {
				formHandler.setFieldState('density', 1);
			}
			if (e.target.value === 'true') {
				formHandler.setFieldState('isLiquid', true);
				return;
			} else if (e.target.value === 'false') {
				formHandler.setFieldState('isLiquid', false);
				return;
			}
		}
		//Resume auto change handling
		formHandler.onChangeHandler(e);
	};

	//Handle delete request. This function needs to go to form footer component
	const handleDelete = () => {
		if (!product) {
			//No product to delete
			return;
		}
		//Handle delete product
		const onSuccess = () => {
			toast.success(t('form.deleteSuccess', { name: product.name }));
			handleClose?.();
		};
		const onError = () => {
			toast.error(t('form.deleteError', { name: product.name }));
		};

		dispatch({ type: 'delete', payload: product.productId, success: onSuccess, error: onError });
	};

	return {
		formState,
		handleChange,
		hasError: formHandler.hasError,
		handleDelete: product ? handleDelete : null,
		handleSubmit: (e) => {
			formHandler.onSubmitHandler(e, handleSubmit);
		},
	};
}
