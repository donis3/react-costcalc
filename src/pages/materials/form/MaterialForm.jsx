import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../components/common/BackButton';
import Card from '../../../components/common/Card';
import Form from '../../../components/forms/Form';
import useConfig from '../../../hooks/app/useConfig';
import useCurrencyConversion from '../../../hooks/app/useCurrencyConversion';
import useIntl from '../../../hooks/common/useIntl';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

//Experimental

export default function MaterialForm({ materialId = null, isEdit = false }) {
	//==========================// Dependencies //===================================//
	const { t } = useTranslation('pages/materials', 'translation');
	const config = useConfig();
	const { displayMoney } = useIntl();
	const { convert, defaultCurrency } = useCurrencyConversion();

	//==========================// Form States //===================================//
	//is form submitted
	const [isSubmitted, setSubmitted] = useState(false);
	const initialState = { unit: 'kg', density: 1, currency: defaultCurrency };
	//For visual UX state handling
	const [visualState, setVisualState] = useState({
		fullPrice: 0,
		currency: defaultCurrency,
		isLiquid: config.isLiquid(initialState.unit),
		unit: initialState.unit,
	});

	//==========================// Form Handling Library //===================================//
	const { schema, joi, register, getError, handleChange, getFormData, setValue, getValue } = useFormBuilder({
		initialState,
		isSubmitted,
	});

	//==========================// Form Schema //===================================//
	schema.materialId = joi.number().min(0).required().label(t('form.materialId'));
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

	//==========================// RENDER //===================================//
	return (
		<>
			{/* Back Button */}
			<BackButton />

			{/* Form */}
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>
					{/* Form title depending on context */}
					{t('form.title')}
				</h3>
				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{t('form.details')}
				</p>

				{/* Form BUilder */}
				<Form onSubmit={(e) => console.log(getFormData())} setSubmitted={setSubmitted}>
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
							<Form.Select options={selectUnit} {...register({ field: 'unit', isControlled: false })} />
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
