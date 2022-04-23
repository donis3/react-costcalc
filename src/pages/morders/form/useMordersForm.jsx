import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEndProductsContext } from '../../../context/MainContext';
import useEndProducts from '../../../hooks/endproducts/useEndProducts';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useMordersForm({ morder = null } = {}) {
	//==========================// Dependencies //===================================//
	const { t } = useTranslation('pages/morders');
	const { endProducts } = useEndProductsContext();
	const products = endProducts.getAllSorted({ field: 'name' });

	//==========================// Form Handling Library //===================================//
	const [isSubmitted, setSubmitted] = useState(false);
	let initialState = { endId: products?.[0]?.endId, quantity: 0 };
	const { schema, joi, register, getError, handleChange, getFormData, setValue, getValue, resetForm } = useFormBuilder({
		initialState,
		isSubmitted,
	});

	//==========================// Form Schema //===================================//
	schema.endId = joi.number().min(0).required().label(t('form.endId'));
	schema.quantity = joi.number().min(0).required().label(t('form.quantity'));

	//==========================// UI States //===================================//
	const [uiState, setUiState] = useState({ quantity: 0 });
	handleChange('quantity', (value) => {
		value = parseInt(value);
		if (isNaN(value)) value = 1;
		setUiState((state) => ({ ...state, quantity: value }));
	});
	//==========================// Select Arrays//===================================//
	const select = {};
	select.endProduct = products.map((item) => ({ name: item.name, value: item.endId }));

	//==================// Handlers //====================//
	function addMorder() {
		try {
			const data = getFormData(true);
			console.log('Will add:', data);
		} catch (error) {}
	}
	function deleteMorder() {
		console.log('Will Delete');
	}
	function updateMorder() {
		console.log('Will Update');
	}
	function handleSubmit() {
		if (morder) {
			updateMorder();
		} else {
			addMorder();
		}
	}
	function handleReset() {
		resetForm();
	}

	//==================// Export //====================//
	return {
		getError,
		register,
		getValue,
		handleChange,
		uiState,
		select,
		actions: {
			submit: handleSubmit,
			delete: deleteMorder,
			reset: handleReset,
			setSubmitted,
		},
	};
}
