import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import Card from '../../components/common/Card';
import Form from '../../components/forms/Form';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useApp from '../../context/app/useApp';
import useEndproducts from '../../context/endproducts/useEndproducts';
import useEndproductsForm from './useEndproductsForm';

export default function EndProductForm({ isEdit = false } = {}) {
	const { endId } = useParams();
	const endProducts = useEndproducts();
	const navigate = useNavigate();
	const endProduct = isEdit ? endProducts.findById(endId) : null;
	const { page } = useApp();

	useEffect(() => {
		//If endproduct is not found in edit mode, send to 404
		if (isEdit && !endProduct) {
			return navigate('/endproducts');
		}
		//In edit mode, set breadcrumb manually
		if (isEdit && endProduct) {
			page?.setBreadcrumb?.(endProduct.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEdit, endProduct, navigate]);

	const { t } = useTranslation('pages/endproducts', 'translation');
	const { formActions, select, getError, register, recipe } = useEndproductsForm({ endProduct });
	const isLiquid = recipe ? recipe.isLiquid : false;

	if (select.recipe.length === 0) return <NoRecipeError />;
	return (
		<>
			{/* Form */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader
					text={isEdit ? t('form.editTitle') : t('form.addTitle')}
					module='endproducts'
					role={isEdit ? 'edit' : 'add'}
				/>
				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{t('form.details')}
				</p>

				{/* EndProducts Form Wrapper */}
				<Form {...formActions}>
					{/* Product Details Section*/}
					<Form.Section title={t('form.subtitle')}>
						{/* Product Name */}
						<Form.Control error={getError('name')} label={t('labels.name')}>
							<Form.Text {...register({ field: 'name', isControlled: false })} />
						</Form.Control>

						{/* Select Recipe */}
						<Form.Control error={getError('recipeId')} label={t('labels.recipe')} altLabel={t('labels.recipeAlt')}>
							<Form.Select options={select.recipe} {...register({ field: 'recipeId', isControlled: true })} />
						</Form.Control>

						{/* Select Package */}
						<Form.Control error={getError('packageId')} label={t('labels.package')} altLabel={t('labels.packageAlt')}>
							<Form.Select options={select.package} {...register({ field: 'packageId', isControlled: true })} />
							{select.package.length === 0 && <NoPackageError isLiquid={isLiquid} />}
						</Form.Control>
					</Form.Section>

					{/* Other Data Section*/}
					<Form.Section title={t('form.subtitle2')}>
						{/* Commercial Name */}
						<Form.Control
							error={getError('commercialName')}
							label={t('labels.commercialName')}
							altLabel={t('labels.commercialNameAlt')}
						>
							<Form.Text {...register({ field: 'commercialName', isControlled: false })} />
						</Form.Control>

						{/* Notes*/}
						<Form.Control error={getError('notes')} label={t('labels.notes')}>
							<Form.Textarea {...register({ field: 'notes', isControlled: false })} />
						</Form.Control>
					</Form.Section>
				</Form>
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
