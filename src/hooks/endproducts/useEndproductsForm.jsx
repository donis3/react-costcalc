import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePackagesContext, useRecipesContext } from '../../context/MainContext';
import useFormHandler from '../common/useFormHandler';
import useJoi from '../common/useJoi';

//Create initial state
const initialState = {
	endId: null,
	recipeId: '',
	packageId: '',

	name: '',
	commercialName: '',
	notes: '',
};

export default function useEndproductsForm({ endProduct = null } = {}) {
	//Load recipes & packages & memoize them
	const packageContext = usePackagesContext();
	const recipeContext = useRecipesContext();
	const recipes = useMemo(() => {
		const result = recipeContext?.recipes?.getAllSorted?.({ field: 'name' });
		return Array.isArray(result) ? result : [];
	}, [recipeContext]);
	const packages = useMemo(() => {
		const result = packageContext?.packages?.getAllSorted?.({ field: 'name' });
		return Array.isArray(result) ? result : [];
	}, [packageContext]);

	const initialFormState = getInitialFormState(recipes, packages, null);
	//Form state
	const [formState, setFormState] = useState(initialFormState);

	//Select Arrays (Will auto update according to formState.)
	const selectRecipeArray = useMemo(() => generateRecipeSelectArray(recipes), [recipes]);
	const selectPackageArray = useMemo(
		() => generatePackageSelectArray(packages, recipes, formState.recipeId),
		[packages, recipes, formState.recipeId]
	);

	const recipe = useMemo(
		() => recipes.find((item) => item.recipeId === formState.recipeId),
		[formState.recipeId, recipes]
	);
	const pack = useMemo(
		() => packages.find((item) => item.packageId === formState.packageId),
		[formState.packageId, packages]
	);

	//Load form handler
	const { hasError, onChangeHandler, onSubmitHandler, setFieldState, errors } = useFormHandler({
		formState,
		setFormState,
		schema: useEndProductsSchema(),
	});

	//When recipe changes, must check if package array changed and packageId should change
	useEffect(() => {
		if (selectPackageArray.length === 0) return;
		const selectedPackage = selectPackageArray.find((item) => parseInt(item.value) === parseInt(formState.packageId));
		if (!selectedPackage) {
			//Selected package was not found in available packages array. Change to default
			setFieldState('packageId', selectPackageArray[0].value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectPackageArray]);

	//Handle Submit
	const onSubmit = (formData) => {
		console.log(formData)
	};

	
	//Hook Exports
	return {
		selectRecipe: selectRecipeArray,
		selectPackage: selectPackageArray,
		handleChange: onChangeHandler,
		hasError,
		handleSubmit: (e) => onSubmitHandler(e, onSubmit),
		formState,

		recipe,
		pack,
	};
} //End of hook

//====================// FORM SELECT ARRAYS //===========================//
const generateRecipeSelectArray = (recipes = null) => {
	//Form requires at least 1 recipe
	if (!Array.isArray(recipes)) return null;

	return recipes.map((item) => {
		return { name: item.name, value: item.recipeId };
	});
};

//use default recipe id if not provided
const generatePackageSelectArray = (packages = null, recipes = null, recipeId = null) => {
	//Form requires at least 1 recipe & package
	if (!Array.isArray(packages) || !Array.isArray(recipes) || recipes.length === 0) return [];
	if (packages.length === 0) return [];
	recipeId = parseInt(recipeId);

	//Validate recipe id or provide default
	if (isNaN(recipeId) || recipeId < 0) {
		recipeId = parseInt(recipes[0].recipeId) ? parseInt(recipes[0].recipeId) : null;
		if (recipeId === null) return [];
	}

	//Find recipe
	const recipe = recipes.find((item) => item.recipeId === recipeId);
	if (!recipe) return [];

	//Filter packages for this product type. Recipe determines this.
	const productType = recipe.isLiquid ? 'liquid' : 'solid';

	return packages.reduce((accumulator, current) => {
		if (current.productType === productType) {
			return [...accumulator, { name: current.name, value: current.packageId }];
		}
		return accumulator;
	}, []);
};

//Initial form state requires calculation
const getInitialFormState = (recipes = null, packages = null, endproduct = null) => {
	if (!recipes || !Array.isArray(recipes) || !packages || !Array.isArray(packages)) {
		console.log('There needs to be recipes & packages available to be able to define end product');
		return initialState;
	}
	if (recipes.length === 0 || !recipes[0] || 'recipeId' in recipes[0] === false) return initialState;
	//Get default recipe
	const { recipeId, isLiquid } = recipes[0];
	if (isNaN(parseInt(recipeId)) || typeof isLiquid !== 'boolean') return initialState;
	initialState.recipeId = parseInt(recipeId);
	const productType = isLiquid ? 'liquid' : 'solid';
	//Find the first suitable package from packages array
	const pack = packages.find((item) => item.productType === productType);
	//get its id
	if (!pack) return initialState;
	initialState.packageId = parseInt(pack.packageId);

	//Id endproduct is null, this is a new product form not edit
	if(!endproduct) {
		delete initialState.endId;
	}

	return initialState;
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
