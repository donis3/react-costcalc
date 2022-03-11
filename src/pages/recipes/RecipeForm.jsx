import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import FormInput from '../../components/form/FormInput';

import { useMaterialContext, useProductsContext, useRecipesContext } from '../../context/MainContext';
import useConfig from '../../hooks/app/useConfig';
import useIntl from '../../hooks/common/useIntl';
import useRecipeForm, { selectRecipeArrayGenerator } from '../../hooks/recipes/useRecipeForm';
import { FaPlus as PlusIcon } from 'react-icons/fa';
import useJoi from '../../hooks/common/useJoi';
import { useAppContext } from '../../context/AppContext';

export default function RecipeForm() {
	const { t } = useTranslation('pages/recipes');
	const { page } = useAppContext();
	const { recipeId } = useParams();
	const navigate = useNavigate();

	const { recipes } = useRecipesContext();
	const recipe = recipes.findById(recipeId, true); //Get recipe data for form

	const { products } = useProductsContext();
	const productList = products.getAllSorted({ field: 'name' });

	const { formState, setFormState, onFieldChange, hasError, onSubmit, resetForm } = useRecipeForm({ recipe });
	const [details, setDetails] = useState({ product: null });
	const { displayNumber } = useIntl();

	const showYieldWeight = () => {
		if (details.product === null) return null;
		if ('isLiquid' in details.product === false || details.product.isLiquid === false) return null;
		const currentYield = formState?.yield;
		const density = details?.product?.density;
		if (!currentYield || !density) return `${displayNumber(0)} kg`;
		return `${displayNumber(currentYield * density, 2)} kg`;
	};

	//Recipe Id change
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

	//Product Id Change
	useEffect(() => {
		//Load active product when component initializes
		setDetails((state) => {
			return { ...state, product: products.findById(formState.productId) };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.productId]);

	return (
		<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
			<h3 className='text-2xl py-2 font-semibold'>
				{/* Form title depending on context */}
				{recipe ? t('form.titleUpdate', {name: recipe.name}) : t('form.titleAdd')}
			</h3>
			<p className='opacity-80'>
				{/* Form lead depending on context */}
				{recipe ? t('form.leadUpdate') : t('form.leadAdd')}
			</p>
			<form onSubmit={onSubmit} className='w-full mt-10'>
				{/* Form Start*/}

				{/* Flex Container for form body */}
				<div className='flex flex-col justify-between gap-10 items-start xl:flex-row gap-y-20 xl:gap-y-0 gap-x-10'>
					{/* Recipe Meta Information */}
					<div className='grid grid-cols-1 gap-y-5 w-full '>
						{/* Form meta title */}
						<h1 className='text-xl m-0 p-0 border-b'>{t('form.titleMeta')}</h1>
						{/* Recipe Meta Data */}
						<FormInput label={t('labels.name')} error={hasError('name')}>
							<FormInput.Text name='name' value={formState.name} onChange={onFieldChange} />
						</FormInput>

						<FormInput label={t('labels.product')} error={hasError('productId')}>
							<FormInput.Select
								name='productId'
								options={selectRecipeArrayGenerator(productList)}
								value={formState.productId}
								onChange={onFieldChange}
							/>
						</FormInput>

						<FormInput
							className='max-w-lg'
							label={t('labels.yield')}
							error={hasError('yield')}
							altLabel={showYieldWeight()}
						>
							<FormInput.Group>
								<FormInput.Text name='yield' value={formState.yield} onChange={onFieldChange} filter='number' />
								<span>
									{details?.product?.isLiquid === true
										? t('units.L', { ns: 'translation', count: Math.round(formState.yield) })
										: t('units.kg', { ns: 'translation', count: Math.round(formState.yield) })}
								</span>
							</FormInput.Group>
						</FormInput>
					</div>
					<div className='w-full'>
						<RecipeFormMaterials formState={formState} setFormState={setFormState} />
					</div>

					{/* End of form body container */}
				</div>
				{/* Form Footer */}
				<div className='mt-10 border-t-2 py-5'>
					<button type='submit' className='btn btn-primary mr-1'>
						{t('buttons.save', { ns: 'translation' })}
					</button>

					<button type='button' className='btn btn-default mr-1' onClick={resetForm}>
						{t('buttons.reset', { ns: 'translation' })}
					</button>
				</div>
			</form>
		</Card>
	);
}

function RecipeFormMaterials({ formState = null, setFormState = null } = {}) {
	const { Materials } = useMaterialContext();
	const { t } = useTranslation('pages/recipes');
	const { displayNumber } = useIntl();
	const [stats, setStats] = useState({ totalWeight: 0, itemCount: 0 });

	useEffect(() => {
		if (Array.isArray(formState.materials) === false || formState.materials.length === 0) {
			setStats({ totalWeight: 0, itemCount: 0 });
		} else {
			const totalWeight = formState.materials.reduce((total, current) => {
				//Find material for this item
				const material = Materials.findById(current.materialId);
				if (!material) return total;
				const currentItemsWeight = parseFloat(material.density) * parseFloat(current.amount);
				return total + currentItemsWeight;
			}, 0);
			const totalCount = formState.materials.length;
			setStats({ totalWeight: totalWeight, itemCount: totalCount });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState.materials]);

	const addMaterial = ({ materialId = null, amount = 0, unit = 'kg' } = {}) => {
		if (materialId === null || !unit) return;
		if (isNaN(parseFloat(amount))) return;
		amount = parseFloat(amount);

		//Create new material
		const newItem = { materialId, amount: parseFloat(amount), unit };

		//Check if material already in state. If so, combine them
		if (formState.materials.find((item) => item.materialId === materialId)) {
			//Combination required
			setFormState((currentState) => {
				//Generate a new materials array and combine the duplicate
				const newMaterialsArray = currentState.materials.map((materialItem) => {
					if (materialItem.materialId === materialId) {
						//Combine old material and newly added one's amounts
						return { materialId, amount: parseFloat(materialItem.amount) + amount, unit };
					} else {
						return materialItem;
					}
				});

				//return new material array to state
				return { ...currentState, materials: newMaterialsArray };
			});
		} else {
			//Add as new item
			setFormState((currentState) => {
				return { ...currentState, materials: [...currentState.materials, newItem] };
			});
		}
	};

	const removeMaterial = (materialId = null) => {
		if (materialId === null) return;
		//Set form state without this material
		setFormState((currentState) => {
			//Generate a new materials array and filter out the removal request
			const newMaterialsArray = currentState.materials.filter((item) => item.materialId !== materialId);
			//return new material array to state
			return { ...currentState, materials: newMaterialsArray };
		});
	};

	if (!formState || !setFormState) return <></>;

	return (
		<>
			{/* Content section title */}
			<div className='flex border-b py-1 mb-3 justify-between items-end'>
				<h1 className='text-xl m-0 p-0'>
					{t('form.titleMaterials')}
					<span className='text-sm opacity-60 ml-1'>({stats.itemCount})</span>
				</h1>
				<div className='text-primary text-sm'>
					{t('form.contentStats', { amount: displayNumber(stats.totalWeight, 2) })}
				</div>
			</div>

			{stats.itemCount === 0 && <div className='mb-5 text-base-content opacity-50'>{t('form.noContent')}</div>}

			<div className='grid grid-cols-6 items-end gap-x-5 gap-y-2 mb-5'>
				{formState.materials &&
					formState.materials.map((item, i) => {
						//Find corresponding material
						const Material = Materials.findById(item.materialId, true);

						return (
							<RecipeFormMaterialItem
								key={i}
								material={Material}
								amount={item.amount}
								unit={item.unit}
								handleDelete={removeMaterial}
							/>
						);
					})}
			</div>

			<RecipeFormMaterialRow materials={Materials} addMaterial={addMaterial} />
		</>
	);
}

//Data keys: materialId, amount, unit
function RecipeFormMaterialItem({ material = null, amount = 0, unit = 'kg', handleDelete = null }) {
	const { t } = useTranslation('translation');
	const { displayNumber } = useIntl();
	if (!material) return <span className='col-span-6 text-error-content p-1'>{t('error.invalidItem')}</span>;
	let amountTitle = null;

	if (material.isLiquid) {
		amountTitle = displayNumber(amount * material.density, 2) + ' kg';
	}

	return (
		<>
			{/*  */}
			<span className='col-span-3 p-1'>{material.name}</span>
			<span className='col-span-2 p-1' title={amountTitle}>{`${displayNumber(amount, 2)} ${unit}`}</span>
			<span className='col-span-1 p-1 flex items-center'>
				<button
					className='btn btn-ghost btn-outline btn-xs text-error-content'
					onClick={() => handleDelete(material.materialId)}
				>
					X
				</button>
			</span>
		</>
	);
}

function RecipeFormMaterialRow({ materials = null, addMaterial = null }) {
	const newMaterialState = (materialId = null) => {
		if (materialId === null) return;
		const data = materials.findById(materialId);
		if (!data) return;

		const materialState = {
			materialId: materialId,
			name: data.name,
			isLiquid: config.isLiquid(data.unit),
			unit: config.getBaseUnit(data.unit),
			density: parseFloat(data.density),
			amount: 0,
			error: null,
		};
		return materialState;
	};
	const defaultMaterial = () => {
		return newMaterialState(materials.getDefaultSelectId(), 0);
	};
	const config = useConfig();
	const [mat, setMat] = useState(defaultMaterial);
	const { t } = useTranslation('translation');
	const Joi = useJoi();
	const schema = Joi.number().min(0.01).required().label(t('fields.amount'));

	//Load new selected material
	useEffect(() => {
		if (isNaN(parseInt(mat.materialId))) return;
		const newState = newMaterialState(mat.materialId, mat.amount);
		setMat(newState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mat.materialId]);

	//Handle form change
	const onChangeHandler = (e) => {
		const { value, name } = e.target;
		if (name === 'materialId' && isNaN(parseInt(value)) === false) {
			setMat((state) => ({ ...state, materialId: parseInt(value) }));
		}
		if (name === 'amount') {
			setMat((state) => ({ ...state, amount: value }));
		}
	};

	const validate = () => {
		const { error } = schema.validate(mat.amount);
		if (error && Array.isArray(error.details) && error.details.length > 0) {
			setMat((state) => ({ ...state, error: error.details[0].message }));
			return false;
		} else {
			setMat((state) => ({ ...state, error: null }));
			return true;
		}
	};

	const handleSubmit = () => {
		//If form not valid return
		if (!validate()) return;
		//copy state
		const data = { ...mat };
		//Send the new material to parent form
		addMaterial(data);
		//Reset form
		setMat(defaultMaterial());
	};

	if (!materials) return <></>;
	return (
		<div className='grid grid-cols-6 items-end gap-x-5 mt-10'>
			<FormInput label={t('fields.name')} className='col-span-3'>
				<FormInput.Select
					name='materialId'
					value={mat.materialId}
					onChange={onChangeHandler}
					options={materials.getSelectOptions()}
				/>
			</FormInput>

			<FormInput label={t('fields.amount')} className='col-span-2'>
				<FormInput.Group>
					<FormInput.Text name='amount' value={mat.amount} onChange={onChangeHandler} filter='number' />
					<span>{mat.unit}</span>
				</FormInput.Group>
			</FormInput>
			<FormInput className='col-span-1'>
				<button type='button' className='btn btn-secondary ' onClick={handleSubmit}>
					<PlusIcon className='text-xl mr-1' /> {t('buttons.add')}
				</button>
			</FormInput>
			{mat.error && <div className='col-span-6 text-error-content text-xs mt-1'>{mat.error}</div>}
		</div>
	);
}
