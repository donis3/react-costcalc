import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Card from '../../../components/common/Card';
import Form from '../../../components/forms/Form';
import useConfig from '../../../hooks/app/useConfig';
import useIntl from '../../../hooks/common/useIntl';

import ModuleHeader from '../../../components/layout/ModuleHeader';
import useApp from '../../../context/app/useApp';

import useMaterials from '../../../context/materials/useMaterials';

import useMoney from '../../../hooks/app/useMoney';
import useMaterialForm from './useMaterialForm';

/**
 * New material form and Edit material together
 * @param {boolean} isEdit if true, will check router params for material ID
 * @returns
 */
export default function MaterialForm({ isEdit = false }) {
	//==========================// Dependencies //===================================//
	const { t } = useTranslation('pages/materials', 'translation');
	const { page } = useApp();
	const { Materials } = useMaterials();
	const { materialId } = useParams();
	const material = isEdit ? Materials.findById(materialId, false) : null;
	const navigate = useNavigate();
	const config = useConfig();
	const { displayMoney } = useIntl();
	const { convert, defaultCurrency } = useMoney();

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

	//==========================// Form Manager//===================================//
	const {
		select,
		initialState,
		getValue,
		handleChange,
		handleReset,
		handleSubmit,
		register,
		setSubmitted,
		setValue,
		getError,
		handleDelete,
	} = useMaterialForm({ material, isEdit });

	//==========================// Form States //===================================//
	//For visual UX state handling
	const [visualState, setVisualState] = useState({
		fullPrice: 0,
		currency: defaultCurrency,
		isLiquid: config.isLiquid(initialState.unit),
		unit: initialState.unit,
	});

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

	//==========================// RENDER //===================================//
	return (
		<>
			{/* Back Button */}

			{/* Form */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
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
				<Form
					onSubmit={handleSubmit}
					onReset={handleReset}
					onDelete={isEdit ? handleDelete : null}
					setSubmitted={setSubmitted}
				>
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
							<Form.Select options={select.units} {...register({ field: 'unit', isControlled: true })} />
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
							<Form.Select options={select.currencies} {...register({ field: 'currency', isControlled: false })} />
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
