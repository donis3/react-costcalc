import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validate as isUuid } from 'uuid';
import useEndproducts from '../../../context/endproducts/useEndproducts';
import { RecipesDispatchContext } from '../../../context/recipes';
import useRecipesDefaults from '../../../context/recipes/useRecipesDefaults';

import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useRecipeForm({ recipe, products } = {}) {
	const { defaultRecipe, generateSchema } = useRecipesDefaults();
	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);
	const isEdit = recipe ? true : false;
	const initialState = recipe ? { ...recipe } : { ...defaultRecipe };
	//=============// External Dependencies //===============//
	const dispatch = useContext(RecipesDispatchContext);
	const navigate = useNavigate();
	const { t } = useTranslation('pages/recipes', 'translation');
	const moduleName = t('name');

	const { t: tEndProducts } = useTranslation('pages/endproducts');
	const { endProducts } = useEndproducts();
	const productList = products.getAllSorted({ field: 'name' });
	//Select first product by default
	if (!recipe && productList?.length > 0) {
		initialState.productId = productList[0].productId;
	}

	//Case: No product available
	useEffect(() => {
		if (!productList || !Array.isArray(productList) || productList.length === 0) {
			toast.warn(t('form.noProducts'));
			navigate('/recipes');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productList]);

	//=============// Form Actions & Helpers //===============//
	/**
	 * Is deleting this recipe allowed
	 * Checks if any endproducts are still using the recipe.
	 * @returns {boolean} true if deletable
	 */
	function isDeleteAllowed() {
		if (!recipe) return false;
		if (endProducts && Array.isArray(endProducts?.data)) {
			const boundEndProducts = endProducts.data.filter((item) => item.recipeId === recipe.recipeId);
			if (boundEndProducts.length > 0) {
				//Stop dispatch. There are related products
				toast.error(tEndProducts('deleteError.recipe', { count: boundEndProducts.length }));
				return false;
			}
		}
		return true;
	}

	function addRecipe(data) {
		const success = () => {
			toast.success(t('success.add', { name: data.name, ns: 'translation' }));
			navigate('/recipes');
		};
		const error = () => toast.error(t('error.addName', { name: moduleName, ns: 'translation' }));
		dispatch({ type: 'add', payload: data, success, error });
	}
	function updateRecipe(data) {
		const success = () => {
			toast.success(t('success.update', { name: data.name, ns: 'translation' }));
			navigate('/recipes');
		};
		const error = () => toast.error(t('error.updateName', { name: moduleName, ns: 'translation' }));
		dispatch({ type: 'update', payload: data, success, error });
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
		setState,
		getValue,
		handleChange,
	} = useFormBuilder({
		initialState,
		isSubmitted,
	});
	//=============// Load Schema //===============//
	generateSchema(schema, joi, isEdit);

	//=============// Handlers //===============//
	const handleSubmit = (e) => {
		try {
			//Get form data merged with initial data
			const data = getFormData(true);
			if (data && !recipe) {
				addRecipe(data);
			} else if (data && recipe) {
				updateRecipe(data);
			}
			//Dispatch
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
		if (!isDeleteAllowed()) return;
		//Proceed with deleting.
		const success = () => {
			toast.success(t('success.delete', { name: recipe.name, ns: 'translation' }));
		};
		const error = () => toast.error(t('error.delete', { ns: 'translation' }));
		dispatch({ type: 'delete', payload: recipe.recipeId, success, error });
		navigate('/recipes');
	};

	//=============// Select Arrays //===============//
	const selectProduct = productList.map((item) => ({ name: item.name, value: item.productId }));

	//=============// Recipe Material Handlers //===============//
	function addMaterial(data) {
		if (!data) return;
		//Load current materials
		const mats = Array.isArray(formState.materials) ? formState.materials : [];
		let newMatsState = [];
		//Check if this material already in state
		if (mats.find((item) => item.materialId === data.materialId)) {
			//Add the new value to it
			newMatsState = mats.map((item) => {
				if (item.materialId === data.materialId) {
					return { ...data, amount: data.amount + item.amount };
				} else {
					return item;
				}
			});
		} else {
			//This material is new to the state
			newMatsState = [...mats, data];
		}
		setState('materials', newMatsState);
	}
	function removeMaterial(materialId) {
		if (!isUuid(materialId)) return;
		//Load current materials
		const mats = Array.isArray(formState.materials) ? formState.materials : [];
		//remove this material
		setState(
			'materials',
			mats.filter((item) => item.materialId !== materialId)
		);
	}

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
		materialControl: {
			add: addMaterial,
			remove: removeMaterial,
		},
		getPartialValidator,
		register,
		getError,
		formState,
		getValue,
		handleChange,
	};
}
