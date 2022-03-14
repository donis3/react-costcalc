import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMaterialContext, useMaterialDispatchContext, useRecipesContext } from '../../context/MainContext';
import useConfig from '../app/useConfig';
import useFormHandler from '../common/useFormHandler';
import useSchemaMaterials from './useSchemaMaterials';

export default function useMaterialsForm({ materialId = null, onSuccess = null, onDelete = null } = {}) {
	//Load config
	const config = useConfig();
	//Load translation
	const { t } = useTranslation('pages/materials');
	//Load context
	const { Materials } = useMaterialContext();
	const { dispatch } = useMaterialDispatchContext();
	const { recipes } = useRecipesContext();

	if (Materials === null) throw new Error('Material Form is Missing dependencies');

	let material = null;
	//Confirm material id
	if (materialId !== null && typeof materialId === 'number') {
		material = Materials.findById(materialId);
		if (!material) {
			//Error loading requested material
			throw new Error(`Requested material id (${parseInt(materialId)}) doesn't exist.`);
		}
	}
	//Determine initial state
	const [formState, setFormState] = useState(material || Materials.defaultObject());

	//Load validation schema
	const schema = useSchemaMaterials();
	//Load form handler
	const { onChangeHandler, setFieldState, onSubmitHandler, hasError } = useFormHandler({
		formState,
		setFormState,
		schema,
	});

	//Load recipes that are bound to this material
	const boundRecipes = recipes.getByMaterial(materialId);

	//custom Handlers
	const handleChange = (e) => {
		//Add special change handlers
		if (e.target.name === 'unit' && config.getUnitType(e.target.value) === 'weight') {
			//A weight unit is selected. Reset density
			setFieldState('density', 1);
		}
		return onChangeHandler(e);
	};

	//Will be called automatically if form is submitted and has no errors.
	const handleSubmit = (data) => {
		//If material exists, this is update form
		if (material && material?.materialId !== null && typeof material.materialId === 'number') {
			dispatch({
				type: 'update',
				payload: data,
				success: () => {
					toast.success(t('form.updateSuccess', { name: data.name }));
					onSuccess?.();
				},
				error: () => {
					toast.error(t('form.updateFail'));
				},
			});
		} else {
			dispatch({
				type: 'add',
				payload: data,
				success: () => {
					toast.success(t('form.addSuccess', { name: data.name }));
					onSuccess?.();
				},
				error: () => {
					toast.error(t('form.addFail'));
				},
			});
		}
	};

	const handleDelete = () => {
		if (!material) return;
		//If any recipe is using this material, disallow
		if (boundRecipes && Array.isArray(boundRecipes) && boundRecipes.length > 0) {
			toast.error(t('form.boundRecipeError', { count: boundRecipes.length }));
			return;
		}

		const successCallback = () => {
			toast.success(t('form.deleteSuccess', { name: material.name }));
			onDelete?.();
			onSuccess?.();
		};
		const errorCallback = () => {
			toast.success(t('form.deleteFail'));
		};

		dispatch({
			type: 'delete',
			payload: material,
			success: successCallback,
			error: errorCallback,
		});
	};

	//Helpers
	const priceWithTax = () => {
		const tax = parseFloat(formState.tax);
		const price = parseFloat(formState.price);
		if (isNaN(price) || isNaN(tax)) {
			//console.warn('Price Calculation: Invalid price or tax percentage supplied');
			return 0;
		}
		return price + price * (tax / 100);
	};

	//==================== Hook Returns
	const payload = {
		material,
		formState,
		onSubmitHandler,
		handleChange,
		handleSubmit,
		handleDelete,
		hasError,
		setFieldState,
		config,
		priceWithTax,
	};
	return payload;
} //End of hook

/* ========================== Helper Functions ====================== */
