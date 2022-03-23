import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { FormFooterActions } from '../../components/common/FormFooterActions';
import FormInput from '../../components/form/FormInput';
import { useEndProductsContext } from '../../context/MainContext';

import useEndproductsForm from '../../hooks/endproducts/useEndproductsForm';

export default function EndProductForm({ isEdit = false } = {}) {
	const { endId } = useParams();
	const {endProducts} = useEndProductsContext();
	console.log(endProducts.getAllSorted())
	const { t } = useTranslation('pages/endproducts', 'translation');
	const {  handleSubmit, handleChange, hasError, formState, selectRecipe, selectPackage, recipe } =
		useEndproductsForm();

	//Render
	if (selectRecipe.length === 0) return <NoRecipeError />;
	return (
		<>
			{/* Back Button */}
			<BackButton />

			{/* Form */}
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>
					{/* Form title depending on context */}
					{t('form.addTitle')}
				</h3>
				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{t('form.details')}
				</p>
				<form onSubmit={handleSubmit} className='w-full mt-10'>
					{/* Form Start*/}

					{/* Flex Container for form */}
					<div className='flex flex-col justify-start gap-10 items-start xl:flex-row gap-y-20 xl:gap-y-0 gap-x-10'>
						{/* Product Definitions Section */}
						<div className='w-full flex flex-col gap-y-5 max-w-lg md:max-w-2xl'>
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.subtitle')}</h1>

							{/* name */}
							<FormInput label={t('labels.name')} error={hasError('name')}>
								<FormInput.Text name='name' onChange={handleChange} value={formState.name} />
							</FormInput>

							{/* Recipe */}
							<FormInput label={t('labels.recipe')} altLabel={t('labels.recipeAlt')} error={hasError('recipeId')}>
								<FormInput.Select
									name='recipeId'
									options={selectRecipe}
									onChange={handleChange}
									value={formState.recipeId}
								/>
							</FormInput>

							{/* Package */}

							<FormInput label={t('labels.package')} altLabel={t('labels.packageAlt')} error={hasError('packageId')}>
								<FormInput.Select
									name='packageId'
									options={selectPackage}
									onChange={handleChange}
									value={formState.packageId}
								/>
								{selectPackage.length === 0 && <NoPackageError isLiquid={recipe?.isLiquid} />}
							</FormInput>
						</div>
						{/* Other Definitions */}
						<div className='w-full flex flex-col gap-y-5 max-w-lg md:max-w-2xl'>
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.subtitle2')}</h1>

							{/* name */}
							<FormInput
								label={t('labels.commercialName')}
								altLabel={t('labels.commercialNameAlt')}
								error={hasError('commercialName')}
							>
								<FormInput.Text name='commercialName' onChange={handleChange} value={formState.commercialName} />
							</FormInput>

							{/* Notes */}
							<FormInput label={t('labels.notes')} error={hasError('notes')}>
								<FormInput.Textarea name='notes' rows='1' onChange={handleChange} value={formState.notes} />
							</FormInput>
						</div>
					</div>
					{/* Form Footer */}

					<FormFooterActions
						className='mt-10 border-t-2 py-5'
						handleDelete={isEdit ? () => console.log('Delete Product') : null}
					>
						<Button.Save className='btn btn-primary btn-md mr-1' type='submit' />
						<Button.Reset className='btn btn-md' type='button' onClick={null} />
					</FormFooterActions>
				</form>
			</Card>
		</>
	);
}

function NoRecipeError() {
	const { t } = useTranslation('pages/endproducts');
	return (
		<>
			{/* Back Button */}
			<BackButton />
			{/* Form */}
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>
					{/* Form title depending on context */}
					{t('form.addTitle')}
				</h3>
				<p className='p-3 bg-error rounded-md border-error'>{t('form.noRecipeError')}</p>
			</Card>
		</>
	);
}

function NoPackageError({ isLiquid = null } = {}) {
	const { t } = useTranslation('pages/endproducts', 'translation');
	const productType = isLiquid ? 'liquid' : 'solid';
	const productTypeText = t('physicalStates.' + productType, { ns: 'translation' });
	return (
		<label className='text-sm text-error-content'>{t('form.noPackageError', { productType: productTypeText })}</label>
	);
}
