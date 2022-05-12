import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import DeleteButton from '../../../components/common/DeleteButton';
import FormPart from '../../../components/form/FormPart';
import Form from '../../../components/forms/Form';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { useAppContext } from '../../../context/AppContext';
import { useProductsContext, useRecipesContext } from '../../../context/MainContext';
import useFormParts from '../../../hooks/forms/useFormParts';
import useRecipeForm from './useRecipeForm';
import { toast } from 'react-toastify';
import useIntl from '../../../hooks/common/useIntl';
import ContentTable from './ContentTable';

export default function RecipeForm2({ isEdit = false }) {
	/**
	 * Load recipes and products repo
	 * check if form is in edit mode and try to find a recipe if so
	 * if recipe is not found, navigate to recipes
	 */
	const { recipeId } = useParams();
	const navigate = useNavigate();
	const { page } = useAppContext();
	const { t } = useTranslation('pages/recipes', 'translation');
	const { displayNumber } = useIntl();

	//Repos
	const { recipes } = useRecipesContext();
	const recipe = recipes.findById(recipeId);
	const { products } = useProductsContext();

	//Verify loaded recipe
	useEffect(() => {
		//Load breadcrumb name
		if (recipe && 'name' in recipe) {
			page.setBreadcrumb(recipe.name);
		}
		if (isEdit && !recipe) {
			toast.warning(t('error.itemNotFound', { ns: 'translation', item: t('name') }));
			navigate('/recipes');
		}
		if (!products || !products?.count) {
			toast.warning(t('form.noProducts'));
			navigate('/recipes');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//=====================// FORM HANDLER //=======================//
	/**
	 * Using multipart forms, define the parts (part names corresponds to formparts.json localization file)
	 *
	 */
	const { controls, getPart, parts } = useFormParts('recipe.details', 'recipe.content', 'recipe.notes');
	const {
		getPartialValidator,
		getError,
		register,
		handlers,
		select,
		handleChange,
		getValue,
		materialControl,
		formState,
	} = useRecipeForm({
		recipe,
		products,
	});

	//=====================// UI STATE HANDLING //=======================//
	/**
	 * Generate a ui state using current form state.
	 * To display correct yield unit & weight
	 * @returns
	 */
	function generateUiState() {
		//Default state
		const result = { isLiquid: false, unit: 'kg', yieldWeight: 0, yield: 0 };
		//Load product from select
		const productId = getValue('productId');
		const product = products.findById(productId);
		if (!product) return result;
		const density = parseFloat(product.density);
		if (isNaN(density)) return result;
		//load yield
		let currentYield = parseFloat(getValue('yield'));
		if (isNaN(currentYield)) currentYield = 0;
		if (product.isLiquid) {
			return {
				isLiquid: true,
				unit: 'L',
				yieldWeight: density * currentYield,
				yield: currentYield,
			};
		} else {
			return {
				isLiquid: false,
				unit: 'kg',
				yieldWeight: currentYield,
				yield: currentYield,
			};
		}
	}
	const [uiState, setUiState] = useState(generateUiState());

	//Form change listener
	handleChange('productId', () => {
		setUiState(generateUiState());
	});
	//Form change listener
	handleChange('yield', () => {
		setUiState(generateUiState());
	});
	//Display yield weight formatted
	const showYieldWeight = () => {
		if (!uiState.isLiquid || uiState.yieldWeight === 0) return;
		return `${displayNumber(uiState.yieldWeight, 2)} kg`;
	};

	//Module title & role
	const module = {
		title: isEdit ? t('form.titleUpdate', { name: recipe.name }) : t('form.titleAdd'),
		role: isEdit ? 'edit' : 'add',
	};

	//=====================// FORM RENDER //=======================//
	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			{/* Card Header */}
			<ModuleHeader text={module.title} module='recipes' role={module.role}>
				<DeleteButton small onClick={recipe ? handlers.delete : null} />
			</ModuleHeader>

			{/* Form Start */}
			<Form footer={false} grid={false} onSubmit={handlers.submit} setSubmitted={handlers.setSubmitted}>
				{/* Form Parts Start */}
				<FormPart.Wrapper parts={parts} controls={controls} onReset={handlers.reset}>
					{/* ========================== FormPart: recipe.details ============================ */}
					<FormPart part={getPart(0)} controls={controls} getValidator={() => getPartialValidator('details')}>
						{/* Field: name */}
						<Form.Control error={getError('name')} label={t('labels.name')}>
							<Form.Text {...register({ field: 'name', isControlled: false, part: 'details' })} />
						</Form.Control>

						{/* Field: productId */}
						<Form.Control error={getError('productId')} label={t('labels.product')}>
							<Form.Select
								{...register({ field: 'productId', isControlled: false, part: 'details' })}
								options={select.product}
								disabled={isEdit ? true : false}
							/>
						</Form.Control>

						{/* Field: yield */}
						<Form.ControlGroup error={getError('yield')} label={t('labels.yield')} altLabel={showYieldWeight()}>
							<Form.Number {...register({ field: 'yield', isControlled: false, part: 'details' })} />
							<span>{t(`units.${uiState.unit}`, { ns: 'translation', count: uiState.yield })}</span>
						</Form.ControlGroup>
					</FormPart>

					{/* ========================== FormPart: recipe.content ============================ */}
					<FormPart part={getPart(1)} controls={controls}>
						<ContentTable
							controls={materialControl}
							recipeMaterials={formState.materials}
							recipeYield={uiState.yieldWeight}
						/>
					</FormPart>

					{/* ========================== FormPart: recipe.notes ============================ */}
					<FormPart part={getPart(2)} controls={controls}>
						{/* Field: notes */}
						<Form.Control error={getError('notes')} label={t('labels.notes')}>
							<Form.Textarea {...register({ field: 'notes', isControlled: false, part: 'notes' })} />
						</Form.Control>
					</FormPart>
				</FormPart.Wrapper>
			</Form>
		</Card>
	);
}
