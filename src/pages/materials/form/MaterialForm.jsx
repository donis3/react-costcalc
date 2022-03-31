import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../components/common/Card';
import Form from '../../../components/forms/Form';
import { useMaterialContext, useMaterialDispatchContext, useRecipesContext } from '../../../context/MainContext';
import useConfig from '../../../hooks/app/useConfig';
import useCurrencyConversion from '../../../hooks/app/useCurrencyConversion';
import useIntl from '../../../hooks/common/useIntl';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../context/AppContext';

import ModuleHeader from '../../../components/layout/ModuleHeader';

/**
 * New material form and Edit material together
 * @param {boolean} isEdit if true, will check router params for material ID
 * @returns
 */
export default function MaterialForm({ isEdit = false }) {
	//==========================// Dependencies //===================================//
	const { t } = useTranslation('pages/materials', 'translation');
	const { page } = useAppContext();
	const { recipes } = useRecipesContext();

	const { Materials } = useMaterialContext();
	const { dispatch } = useMaterialDispatchContext();

	const { materialId } = useParams();
	const material = isEdit ? Materials.findById(materialId, false) : null;
	const navigate = useNavigate();

	const config = useConfig();
	const { displayMoney } = useIntl();
	const { convert, defaultCurrency } = useCurrencyConversion();

	//==========================// Form States //===================================//
	//is form submitted
	const [isSubmitted, setSubmitted] = useState(false);
	let initialState = { unit: 'kg', density: 1, currency: defaultCurrency };
	if (material) {
		initialState = { ...initialState, ...material };
	}

	//For visual UX state handling
	const [visualState, setVisualState] = useState({
		fullPrice: 0,
		currency: defaultCurrency,
		isLiquid: config.isLiquid(initialState.unit),
		unit: initialState.unit,
	});

	//==========================// effects //===================================//
	useEffect(() => {
		//If a material was requested but couldn't be found, toast warning and return to materials
		if (isEdit === true && !material) {
			toast.warn(t('error.itemNotFound', { ns: 'translation', item: t('name') }));
			navigate('/materials');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [material, isEdit]);

	//Calculate current try price on load
	useEffect(() => {
		priceChangeHandler();

		//Only run on mount
		if (isEdit && material) {
			page.setBreadcrumb(material.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//==========================// Form Handling Library //===================================//
	const { schema, joi, register, getError, handleChange, getFormData, setValue, getValue } = useFormBuilder({
		initialState,
		isSubmitted,
	});

	//==========================// Form Schema //===================================//
	if (isEdit) schema.materialId = joi.number().min(0).required().label(t('form.materialId'));
	schema.name = joi.string().min(3).max(100).required().label(t('form.name'));
	schema.provider = joi.string().min(3).max(100).required().label(t('form.provider'));
	schema.density = joi.number().positive().precision(2).required().label(t('form.density'));
	schema.tax = joi.number().min(0).precision(2).required().label(t('form.tax'));
	schema.price = joi.number().min(0).precision(2).required().label(t('form.price'));
	//Selects
	schema.unit = joi
		.string()
		.min(1)
		.required()
		.valid(...config.getUnitsArray())
		.label(t('form.unit'));
	schema.currency = joi
		.string()
		.uppercase()
		.min(1)
		.valid(...config.getCurrenciesArray())
		.required()
		.label(t('form.currency'));

	//==========================// Form Select Arrays Data //===================================//
	const selectCurrency = config.getLocalizedCurrencies({ longNames: true, symbols: true });
	const selectUnit = config.getLocalizedUnitSelectOptions({ weight: true, volume: true });

	//==========================// Custom onChange Handlers //===================================//

	//Price Change Calculator
	const priceChangeHandler = () => {
		let price = getValue('price');
		let tax = getValue('tax');
		let currency = getValue('currency');

		if (isNaN(parseFloat(price))) price = 0;
		if (isNaN(parseFloat(tax))) tax = 0;
		const fullPrice = price === 0 ? 0 : price * (1 + tax / 100);
		const fullPriceInLocalCurrency = convert(fullPrice, currency, defaultCurrency).amount;
		setVisualState((state) => ({ ...state, fullPrice: fullPriceInLocalCurrency, currency: defaultCurrency }));
	};
	//Bind events
	handleChange('tax', priceChangeHandler);
	handleChange('price', priceChangeHandler);
	handleChange('currency', priceChangeHandler);
	handleChange('unit', (value) => {
		const isLiquid = config.isLiquid(value);
		setVisualState((state) => ({ ...state, isLiquid, unit: value }));
		if (isLiquid === false) {
			setValue('density', 1);
		}
	});

	//==========================// Form Handlers //===================================//
	const handleSubmit = (e) => {
		//Define dispatches
		const handleUpdateMaterial = (data) => {
			dispatch({
				type: 'update',
				payload: data,
				success: () => {
					toast.success(t('form.updateSuccess', { name: data.name }));
					navigate('/materials/' + data.materialId);
				},
				error: (code = 'update') => toast.error(t('error.' + code, { ns: 'translation' })),
			});
		};
		const handleAddMaterial = (data) => {
			dispatch({
				type: 'add',
				payload: data,
				success: () => {
					toast.success(t('form.addSuccess', { name: data.name }));
					navigate('/materials/' + data.materialId);
				},
				error: (code = 'add') => toast.error(t('error.' + code, { ns: 'translation' })),
			});
		};

		//Execute
		try {
			const data = getFormData(true);
			if (!isEdit) {
				handleAddMaterial(data);
			} else {
				handleUpdateMaterial(data);
			}
		} catch (err) {
			//Form errors.
		}
	};

	const handleReset = () => {
		Object.keys(initialState).forEach((key) => {
			setValue(key, initialState[key]);
		});
	};

	const handleDelete = () => {
		if (!material) return;
		const boundRecipes = recipes.getByMaterial(material.materialId) || [];

		//If any recipe is using this material, disallow
		if (boundRecipes && Array.isArray(boundRecipes) && boundRecipes.length > 0) {
			toast.error(t('form.boundRecipeError', { count: boundRecipes.length }));
			return;
		}
		dispatch({
			type: 'delete',
			payload: material,
			success: () => {
				toast.success(t('form.deleteSuccess', { name: material.name }));
				navigate('/materials/');
			},
			error: (code = 'delete') => toast.error(t('error.' + code, { ns: 'translation' })),
		});
	};

	//==========================// RENDER //===================================//
	return (
		<>
			{/* Back Button */}

			{/* Form */}
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<ModuleHeader
					module='materials'
					text={isEdit ? t('form.updateTitle') : t('form.title')}
					role={isEdit ? 'edit' : 'add'}
				/>

				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{t('form.details')}
				</p>

				{/* Form BUilder */}
				<Form onSubmit={handleSubmit} onReset={handleReset} onDelete={handleDelete} setSubmitted={setSubmitted}>
					{/* First Section */}
					<Form.Section title={t('form.firstSection')}>
						{/* Material Name */}
						<Form.Control error={getError('name')} label={t('form.name')}>
							<Form.Text {...register({ field: 'name', isControlled: false })} />
						</Form.Control>

						{/* Material Density */}
						{/* TODO: Make it group control and add unit select */}
						<Form.Control error={getError('density')} label={t('form.density')} altLabel={t('form.densityAlt')}>
							<Form.Number
								disabled={visualState.isLiquid ? undefined : true}
								{...register({ field: 'density', isControlled: false })}
							/>
						</Form.Control>

						<Form.Control error={getError('unit')} label={t('form.unit')} altLabel={t('form.unitAlt')}>
							<Form.Select options={selectUnit} {...register({ field: 'unit', isControlled: true })} />
						</Form.Control>
					</Form.Section>

					{/* Second Section */}
					<Form.Section title={t('form.secondSection')}>
						{/* Material Provider */}
						<Form.Control error={getError('provider')} label={t('form.provider')} altLabel={t('form.providerAlt')}>
							<Form.Text {...register({ field: 'provider', isControlled: false })} />
						</Form.Control>
						{/* Price Group */}
						<Form.ControlGroup
							error={[getError('price'), getError('currency')]}
							label={t('form.price')}
							altLabel={t('form.priceAlt', {
								amount: displayMoney(visualState.fullPrice, visualState.currency),
								unit: t('units.' + visualState.unit, { ns: 'translation' }),
							})}
						>
							<Form.Number {...register({ field: 'price', isControlled: false })} />
							<Form.Select options={selectCurrency} {...register({ field: 'currency', isControlled: false })} />
						</Form.ControlGroup>

						{/* Tax */}
						<Form.Control error={getError('tax')} label={t('form.tax')} altLabel={t('form.taxAlt')}>
							<Form.Number {...register({ field: 'tax', isControlled: false })} />
						</Form.Control>
					</Form.Section>
				</Form>
			</Card>
		</>
	);
}
