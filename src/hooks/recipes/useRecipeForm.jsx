import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRecipesDispatchContext } from '../../context/MainContext';

import useStorageState from '../common/useStorageState';
import useRecipeFormSchema from './useRecipeFormSchema';

export default function useRecipeForm({ recipe = undefined } = {}) {
	const storageKey = recipe ? 'edit-recipe-form' : 'add-recipe-form';
	const { t } = useTranslation('translation');
	const { dispatch } = useRecipesDispatchContext();

	//Form Schema
	const { partialSchemas, schema, defaults } = useRecipeFormSchema();

	//Todo: if this is edit form, reset stored data and load from recipe instead.
	const [formState, setFormState] = useStorageState(storageKey, recipe || defaults);
	const [errors, setErrors] = useState({});

	//Check for local storage corruption
	useEffect(() => {
		if (
			typeof formState !== 'object' ||
			'materials' in formState === false ||
			Array.isArray(formState.materials) === false
		) {
			//Invalid form state
			setFormState(defaults);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState]);

	//Id item is updated, reload recipe data to form state
	useEffect(() => {
		if (!recipe) return;

		setFormState((state) => {
			return recipe;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipe]);

	//Handle change for form
	const onFieldChange = (e) => {
		const { name, value } = e.target;

		//Validate
		if (name in partialSchemas) {
			const result = partialSchemas[name].validate(value);
			if (result.error && result.error.message) {
				//This field has error
				setErrors((currentErrors) => {
					return { ...currentErrors, [name]: result.error.message };
				});
			} else {
				//This field has no error. Remove any errors associated with this field
				if (name in errors) {
					setErrors((currentErrors) => {
						delete currentErrors[name];
						return currentErrors;
					});
				}
			}
		}

		//Send it to state
		setFormState((currentState) => {
			return { ...currentState, [name]: value };
		});
	};

	//Show if this field has any error
	const hasError = (fieldName = null) => {
		if (!fieldName) return null;
		return fieldName in errors ? errors[fieldName] : false;
	};

	const setError = (fieldName = null, message = null) => {
		//Invalid requests
		if (!fieldName) return null;
		if (fieldName in errors === false && !message) return null;

		//Removal Request
		if (!message) {
			return setErrors((currentErrors) => {
				delete currentErrors[fieldName];
				return currentErrors;
			});
		}

		//Add Request
		return setErrors((currentErrors) => {
			return { ...currentErrors, [fieldName]: message };
		});
	};

	const validateForm = () => {
		const { error, value } = schema.validate(formState);

		if (error && error.details && Array.isArray(error.details)) {
			//There are errors
			error.details.forEach((item) => {
				const { key } = item?.context;
				if (key && key in formState) {
					setError(key, item.message);
				}
			});
			return null;
		} else {
			//There are no errors
			setErrors({});
			return value;
		}
	};

	const onSubmit = (e) => {
		e.preventDefault();
		//Validate
		const result = validateForm();

		//ADD or UPDATE
		if (result && !recipe) {
			//Data is valid
			const success = () => toast.success(t('success.add', { name: formState.name }));
			const error = () => toast.error(t('error.add'));
			dispatch({ type: 'add', payload: result, success, error });
			resetForm();
		} else if (result && recipe) {
			//Data is valid
			const success = () => toast.success(t('success.update', { name: formState.name }));
			const error = () => toast.error(t('error.update'));
			dispatch({ type: 'update', payload: result, success, error });
			resetForm();
		}
	};

	const resetForm = () => {
		setFormState((state) => {
			if (recipe) return recipe;
			return defaults;
		});
		setErrors(() => ({}));
	};

	return { formState, setFormState, onFieldChange, hasError, onSubmit, resetForm };
}

//Helpers
export const selectRecipeArrayGenerator = (recipeArray = null) => {
	if (Array.isArray(recipeArray) === false) return [];
	const result = [];
	recipeArray.forEach((item) => {
		//Each select option
		const selectOption = { name: item.name, value: item.productId };
		result.push(selectOption);
	});

	return result;
};
