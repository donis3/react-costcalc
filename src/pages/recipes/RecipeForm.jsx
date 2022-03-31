import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import FormInput from '../../components/form/FormInput';
import { useProductsContext, useRecipesContext } from '../../context/MainContext';
import useIntl from '../../hooks/common/useIntl';
import useRecipeForm, { selectRecipeArrayGenerator } from '../../hooks/recipes/useRecipeForm';
import { useAppContext } from '../../context/AppContext';
import RecipeFormMaterials from './formComponents/RecipeFormMaterials';
import { FormFooterActions } from '../../components/common/FormFooterActions';
import useRecipe from '../../hooks/recipes/useRecipe';
import ModuleHeader from '../../components/layout/ModuleHeader';

export default function RecipeForm() {
	const { t } = useTranslation('pages/recipes');
	const { page } = useAppContext();
	const { recipeId } = useParams();
	const navigate = useNavigate();

	const { recipes } = useRecipesContext();
	const recipe = recipes.findById(recipeId);
	useRecipe(recipeId); //Will load recipe class for cost calculations

	const { products } = useProductsContext();
	const productList = products.getAllSorted({ field: 'name' });
	const product = recipe ? products.findById(recipe.productId) : null;

	const { formState, setFormState, onFieldChange, hasError, onSubmit, resetForm, onDelete } = useRecipeForm({ recipe });
	const [details, setDetails] = useState({ product: null });
	const { displayNumber } = useIntl();

	//Handle Recipe Id change
	useEffect(() => {
		if (recipeId !== undefined && !recipe) {
			//A recipeId parameter is passed with no result
			return navigate('/notfound');
		}
		//Load active product when component initializes
		setDetails((state) => {
			return { ...state, product: products.findById(formState.productId) };
		});

		//Load breadcrumb name
		if (recipe && 'name' in recipe) {
			page.setBreadcrumb(recipe.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recipeId]);

	//Handle Product Id Change
	useEffect(() => {
		//Load active product when component initializes
		const activeProduct = products.findById(formState.productId);
		if (!activeProduct && products) {
			//Product not found! get default productId and set it to form state
			const { productId } = products.getDefaultProduct() || {};
			if (productId !== formState.productId) setFormState((state) => ({ ...state, productId }));
			return;
		}
		setDetails((state) => {
			return { ...state, product: activeProduct };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.productId]);

	//Helper function to display yield in kg if product is liquid
	const showYieldWeight = () => {
		if (!details.product) return null;
		if ('isLiquid' in details.product === false || details.product.isLiquid === false) return null;
		const currentYield = formState?.yield;
		const density = details?.product?.density;
		if (!currentYield || !density) return `${displayNumber(0)} kg`;
		return `${displayNumber(currentYield * density, 2)} kg`;
	};

	//Unable to add recipe if no products are available
	if (!productList || !Array.isArray(productList) || productList.length === 0) {
		return (
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>
					{/* Form title depending on context */}
					{recipe ? t('form.titleUpdate', { name: recipe.name }) : t('form.titleAdd')}
				</h3>
				<p>{t('form.noProducts')}</p>
				<div className='flex justify-center py-3'>
					<Link to='/products' className='btn btn-primary'>
						{t('form.goToProducts')}
					</Link>
				</div>
			</Card>
		);
	}

	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader
					text={recipe ? t('form.titleUpdate', { name: recipe.name }) : t('form.titleAdd')}
					module='recipes'
					role={recipe ? 'edit' : 'add'}
				/>

				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{recipe ? t('form.leadUpdate') : t('form.leadAdd')}
				</p>
				<form onSubmit={onSubmit} className='w-full mt-10'>
					{/* Form Start*/}

					{/* Flex Container for form */}
					<div className='flex flex-col justify-between gap-10 items-start xl:flex-row gap-y-20 xl:gap-y-0 gap-x-10'>
						{/* Recipe Meta Information */}
						<div className='grid grid-cols-1 gap-y-5 w-full max-w-lg md:max-w-xl'>
							{/* Form meta title */}
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.titleMeta')}</h1>
							{/* Recipe Meta Data */}
							<FormInput label={t('labels.name')} error={hasError('name')}>
								<FormInput.Text name='name' value={formState.name} onChange={onFieldChange} />
							</FormInput>

							{recipe ? (
								<FormInput label={t('labels.product')}>
									<input type='text' disabled className='input input-bordered' value={product.name} />
								</FormInput>
							) : (
								<FormInput label={t('labels.product')} error={hasError('productId')}>
									<FormInput.Select
										name='productId'
										options={selectRecipeArrayGenerator(productList)}
										value={formState.productId}
										onChange={onFieldChange}
									/>
								</FormInput>
							)}

							<FormInput className='' label={t('labels.yield')} error={hasError('yield')} altLabel={showYieldWeight()}>
								<FormInput.Group>
									<FormInput.Text name='yield' value={formState.yield} onChange={onFieldChange} filter='number' />
									<span>
										{details?.product?.isLiquid === true
											? t('units.L', { ns: 'translation', count: Math.round(formState.yield) })
											: t('units.kg', { ns: 'translation', count: Math.round(formState.yield) })}
									</span>
								</FormInput.Group>
							</FormInput>

							<h1 className='text-xl mt-5 p-0 border-b-8'>{t('form.titleOther')}</h1>
							<FormInput label={t('labels.notes')} error={hasError('notes')}>
								<FormInput.Textarea name='notes' value={formState.notes} onChange={onFieldChange} rows='4' />
							</FormInput>
						</div>

						{/* Recipe Contents (MAterials in the recipe) */}
						<div className='w-full'>
							<RecipeFormMaterials formState={formState} setFormState={setFormState} details={details} />
						</div>

						{/* End of form body container */}
					</div>
					{/* Form Footer */}

					<FormFooterActions className='mt-10 border-t-2 py-5' handleDelete={recipe ? onDelete : null}>
						<button type='submit' className='btn btn-primary mr-1'>
							{t('buttons.save', { ns: 'translation' })}
						</button>

						<button type='button' className='btn btn-default mr-1' onClick={resetForm}>
							{t('buttons.reset', { ns: 'translation' })}
						</button>
					</FormFooterActions>
				</form>
			</Card>
		</>
	);
}
