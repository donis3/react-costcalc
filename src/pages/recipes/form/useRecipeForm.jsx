import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';
import { defaultRecipeSchema } from '../../../hooks/recipes/useRecipeFormSchema';

export default function useRecipeForm({ recipe, products } = {}) {
	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);

	const initialState = recipe ? { ...recipe } : { ...defaultRecipeSchema };
	//=============// External Dependencies //===============//
	const productList = products.getAllSorted({ field: 'name' });
	//Select first product by default
	if (!recipe) {
		initialState.productId = productList[0].productId;
	}

	//=============// Form Builder //===============//
	const {
		schema,
		joi,
		register,
		getError,
		getFormData,
		resetForm,
		getPartialValidator,
		formState,
		getValue,
		handleChange,
	} = useFormBuilder({
		initialState,
		isSubmitted,
	});
	//=============// Load Schema //===============//
	useRecipeSchema(schema, joi);

	//=============// Handlers //===============//
	const handleSubmit = (e) => {
		console.log('Will submit');
		try {
			const data = getFormData(false);
			console.log(data);
		} catch (err) {
			//Form errors.
		}
	};

	const handleReset = () => {
		resetForm();
		setSubmitted(false);
	};

	const handleDelete = () => {
		if (!recipe) return;
		console.log(`Delete Recipe`);
	};

	//=============// Select Arrays //===============//
	const selectProduct = productList.map((item) => ({ name: item.name, value: item.productId }));

	//=============// Export //===============//
	return {
		handlers: {
			submit: handleSubmit,
			reset: handleReset,
			delete: handleDelete,
			setSubmitted: setSubmitted,
		},
		select: {
			product: selectProduct,
		},
		getPartialValidator,
		register,
		getError,
		formState,
		getValue,
		handleChange,
	};
}

/**
 * Partial Schema
 * @param {*} joi
 */
function useRecipeSchema(schema, joi) {
	const { t } = useTranslation('pages/recipes');
	schema.name = joi.string().min(3).max(50).required().label(t('labels.name'));
	schema.notes = joi.string().min(0).max(500).label(t('labels.notes'));
	schema.recipeId = joi.number().integer().min(0).label(t('labels.recipeId'));
	schema.productId = joi.number().integer().min(0).label(t('labels.productId'));
	schema.yield = joi.number().min(0.01).label(t('labels.yield'));
	schema.materials = joi.array().label(t('labels.materialId'));
	return schema;
}
