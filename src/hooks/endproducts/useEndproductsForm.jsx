import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEndProductsDispatch, usePackagesContext, useRecipesContext } from '../../context/MainContext';
import useFormHandler from '../common/useFormHandler';
import useJoi from '../common/useJoi';

export default function useEndproductsForm({ endProduct = null } = {}) {
	const { t } = useTranslation('pages/endproducts', 'translation');
	const navigate = useNavigate();
	//Load end product dispatch
	const { dispatch } = useEndProductsDispatch();
	//Load recipes & packages & memoize them
	const { packages: packageRepo } = usePackagesContext();
	const { recipes: recipeRepo } = useRecipesContext();

	//Load select options
	const selectData = useMemo(() => generateSelectOptions(recipeRepo, packageRepo), [recipeRepo, packageRepo]);

	//Form State
	const [formState, setFormState] = useState(getInitialState(endProduct, selectData));

	//Load form handler
	const { hasError, onChangeHandler, onSubmitHandler } = useFormHandler({
		formState,
		setFormState,
		schema: useEndProductsSchema(),
	});

	//When recipe changes, change selected package if needed
	useEffect(() => {
		const recipeId = parseInt(formState.recipeId);
		if (isNaN(recipeId) === false) {
			//check if selected package is suitable
			if (!selectData.isPackageSuitable(recipeId, formState.packageId)) {
				//Selected package is not suitable
				const { packageId } = selectData.getDefaultPackage(recipeId) ? selectData.getDefaultPackage(recipeId) : {};
				if (!isNaN(parseInt(packageId)) && parseInt(packageId) !== parseInt(formState.packageId)) {
					setFormState((state) => ({ ...state, packageId: parseInt(packageId) }));
				} else {
					//Set package to invalid id so form wont submit.
					setFormState((state) => ({ ...state, packageId: 'notfound' }));
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.recipeId]);

	//Handle Submit
	const onSubmit = (formData) => {
		
		if (!endProduct) {
			return dispatch({
				type: 'add',
				payload: { ...formData },
				onSuccess: function () {
					toast.success(t('success.add', { name: formData.name, ns: 'translation' }), { toastId: 'productAdd' });
					navigate('/endproducts');
				},
				onError: function (errCode) {
					if (errCode === 'duplicate') {
						return toast.error(t('error.duplicate'));
					}
					return toast.error(t('error.add', { name: formData.name, ns: 'translation' }), { toastId: 'productAdd' });
				},
			});
		}
		if (endProduct) {
			return dispatch({
				type: 'update',
				payload: { ...formData, endId: endProduct.endId },
				onSuccess: function () {
					toast.success(t('success.update', { name: formData.name, ns: 'translation' }), {
						toastId: 'productUpdate',
					});
					navigate('/endproducts');
				},
				onError: function (errCode = null) {
					let toastMsg = t('error.update', { name: formData.name, ns: 'translation' });
					if (errCode) toastMsg = t('error.' + errCode, { name: formData.name });
					return toast.error(toastMsg, { toastId: 'productUpdate' });
				},
			});
		}

		//dispatch({ type: 'reset' });
	};

	const onDelete = () => {
		if (!endProduct) return;

		return dispatch({
			type: 'delete',
			payload: endProduct.endId,
			onSuccess: function () {
				toast.success(t('success.delete', { name: endProduct.name, ns: 'translation' }), { toastId: 'productDelete' });
				navigate('/endproducts');
			},
			onError: function (errCode) {
				let toastMsg = t('error.delete', { name: endProduct.name, ns: 'translation' });
				if (errCode) toastMsg = t('error.' + errCode, { name: endProduct.name });
				return toast.error(toastMsg, { toastId: 'productDelete' });
			},
		});
	};

	const onReset = () => {
		const newState = getInitialState(endProduct, selectData);
		return setFormState((state) => ({ ...state, ...newState }));
	};

	//Hook Exports
	return {
		selectRecipe: selectData.recipes,
		selectPackage: selectData.getPackages(formState.recipeId),
		handleChange: onChangeHandler,
		hasError,
		handleSubmit: (e) => onSubmitHandler(e, onSubmit),
		onReset,
		onDelete,
		formState,
		recipe: { isLiquid: false },
	};
} //End of hook
//=======================================//
// Initial form state
//=======================================//
const getInitialState = (endProduct = null, selectData = null) => {
	let result = {
		recipeId: '',
		packageId: '',
		name: '',
		commercialName: '',
		notes: '',
	};

	//Find default recipe and package id's
	const { recipeId = null } = selectData?.getDefaultRecipe() ? selectData?.getDefaultRecipe() : {};
	const { packageId = null } = selectData?.getDefaultPackage() ? selectData.getDefaultPackage() : {};

	if (!endProduct && (!recipeId || !packageId)) {
		return result;
	}

	if (endProduct && 'endId' in endProduct) {
		//Export data from endproduct as initial state
		Object.keys(endProduct).forEach((key) => {
			if (key in result) result[key] = endProduct[key];
		});
		//Add id
		result.endId = endProduct.endId;
		//Validate recipeId and PackageId
		const selectedRecipe = selectData.recipes.find((item) => item.recipeId === endProduct.recipeId);

		if (!selectedRecipe) {
			//This recipe is not available in the list, revert to default
			if (recipeId !== undefined) result.recipeId = recipeId;
			if (packageId !== undefined) result.packageId = packageId;
		} else {
			//selected recipe is available but check if selected package is also available
			//must validate if the product package is suitable for this recipe
			if (!selectData.isPackageSuitable(endProduct.recipeId, endProduct.packageId)) {
				//package is not suitable. Must revert to default package for this type
				const defaultPackage = selectData.getDefaultPackage(endProduct.recipeId);
				if (defaultPackage) {
					result.packageId = defaultPackage.packageId;
				}
			}
		}
	}
	//Replace recipeId and packageId with defaults
	if (!endProduct && selectData) {
		if (recipeId !== undefined) result.recipeId = recipeId;
		if (packageId !== undefined) result.packageId = packageId;
	}
	return result;
};

//=======================================//
// Dynamic and dependand select options for recipe & package
//=======================================//
const generateSelectOptions = (recipes = null, packages = null) => {
	//Default Result
	const result = {
		recipes: [],
		packages: {
			solid: [],
			liquid: [],
		},
		getPackages: function (recipeId = null) {
			if (!Array.isArray(this.recipes) || this.recipes.length === 0) return [];
			recipeId = parseInt(recipeId);
			//If given recipe ID is invalid or not in available recipes, revert to default
			if (isNaN(recipeId) || !this.recipes.find((item) => item.recipeId === recipeId)) {
				recipeId = this.recipes[0].recipeId;
			}
			//Get type for this recipe
			const recipeType = this.getRecipeType(recipeId);

			return this.packages[recipeType];
		},

		getDefaultPackage: function (recipeId = null) {
			if (recipeId !== null && isNaN(parseInt(recipeId)) === false) {
				//A recipe id is provided. Get default package for this
				const recipeType = this.getRecipeType(recipeId);
				if (this.packages[recipeType].length > 0) {
					//A suitable package was found
					return this.packages[recipeType][0];
				}
				return null;
			}
			if (!this.getDefaultRecipe()) return null;
			const type = this.getDefaultRecipe().isLiquid ? 'liquid' : 'solid';
			if (this.packages[type].length === 0) return null;
			return this.packages[type][0];
		},
		getDefaultRecipe: function () {
			if (this.recipes.length === 0) return null;
			return this.recipes[0];
		},
		getRecipeType: function (recipeId = null) {
			recipeId = parseInt(recipeId);
			let recipe = this.recipes.find((item) => item.recipeId === recipeId);
			if (!recipe) {
				recipe = this.getDefaultRecipe();
				if (!recipe) return 'solid';
				return recipe.isLiquid ? 'liquid' : 'solid';
			} else {
				return recipe.isLiquid ? 'liquid' : 'solid';
			}
		},
		isPackageSuitable: function (recipeId = null, packageId = null) {
			recipeId = parseInt(recipeId);
			packageId = parseInt(packageId);
			if (isNaN(recipeId) || isNaN(packageId)) return false;
			//Find recipe type
			const type = this.getRecipeType(recipeId);
			//check if the package id is in the array of packages for this type
			const pack = this.packages[type].find((item) => item.packageId === packageId);
			if (!pack) {
				//Package is not suitable
				return false;
			}
			return true;
		},
	};
	//Validate Recipes
	if (!recipes || typeof recipes.getAllSorted !== 'function') return result;
	//Load recipes and map them for select options (Include isLiquid data)
	const sortedRecipes = recipes.getAllSorted({ field: 'name', asc: true });
	if (!Array.isArray(sortedRecipes) || sortedRecipes.length === 0) return result;
	result.recipes = sortedRecipes.map((item) => ({
		name: item.name,
		value: item.recipeId,
		isLiquid: item.isLiquid,
		recipeId: item.recipeId,
	}));

	//Validate packages
	if (!packages || typeof packages.getAllSorted !== 'function') return result;
	//Load packages
	const sortedPackages = packages.getAllSorted({ field: 'name' });
	const solidPackages = sortedPackages.filter((item) => item.productType === 'solid');
	const liquidPackages = sortedPackages.filter((item) => item.productType === 'liquid');
	//Map them for select opts
	result.packages.liquid = liquidPackages.map((item) => ({
		name: item.name,
		value: item.packageId,
		packageId: item.packageId,
	}));
	result.packages.solid = solidPackages.map((item) => ({
		name: item.name,
		value: item.packageId,
		packageId: item.packageId,
	}));

	//console.log('Select Options Generated');
	//Return result
	return result;
};

//=======================================//
//End Products Schema
//=======================================//
export function useEndProductsSchema() {
	const { t } = useTranslation('pages/endproducts');
	const Joi = useJoi();

	const schema = Joi.object({
		endId: Joi.number().min(0).label(t('name')),
		recipeId: Joi.number().min(0).required().label(t('labels.recipe')),
		packageId: Joi.number().min(0).required().label(t('labels.package')),

		name: Joi.string().min(3).max(100).required().label(t('labels.name')),
		commercialName: Joi.string().min(3).max(100).required().label(t('labels.commercialName')),
		notes: Joi.string().min(0).max(500).label(t('labels.notes')),
	});

	return schema;
}
