import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import FormInput from '../../components/form/FormInput';
import { useCurrencyContext, useCurrencyDispatch } from '../../context/MainContext';
import useFormHandler from '../../hooks/common/useFormHandler';

import useJoi from '../../hooks/common/useJoi';
import NotFound from '../NotFound';
import CurrencyError from './CurrencyError';

import { useAppContext } from '../../context/AppContext';
import CurrencyChart from './CurrencyChart';

export default function Currency() {
	const { t } = useTranslation();
	const { currency } = useParams();
	const { currencies } = useCurrencyContext();
	const { dispatch } = useCurrencyDispatch();
	const { page } = useAppContext();
	const { pathname } = useLocation();
	const Joi = useJoi();
	const [formState, setFormState] = useState({ rate: 0 });
	const schema = Joi.object({
		rate: Joi.number().min(0).required().label(t('currency.formRate')),
	});
	const { hasError, onChangeHandler, onSubmitHandler } = useFormHandler({ formState, setFormState, schema });

	useEffect(() => {
		//

		setFormState({ rate: currencies.getCurrentRate(currency) });
	}, [currency, currencies]);

	useEffect(() => {
		page.setBreadcrumb(t('currency.' + currency));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleSubmit = (data) => {
		//new conversion rate submitted, handle it
		if (!data || data?.rate <= 0) return;

		//Create payload for dispatch
		const payload = { from: currency, to: currencies.defaultCurrency, rate: data.rate };
		const success = () => toast.success(t('currency.addSuccess', { from: currency, to: currencies.defaultCurrency }));
		const error = () => toast.error(t('currency.addError'));

		dispatch({ type: 'add', payload, success, error });
	};

	if (!currencies || 'enabledCurrencies' in currencies === false || currencies.enabledCurrencies.length === 0) {
		return <CurrencyError />;
	}
	if (!currency || currencies.enabledCurrencies.includes(currency) === false) {
		return <NotFound />;
	}
	return (
		<>
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
				<h3 className='text-2xl py-2 font-semibold'>
					{/* Title with long currency name */}
					{t('currency.titleCurrency', { currency: t(`currency.${currency}`) })}
				</h3>
				{/* Details text about this module */}
				<p className='opacity-80'>{t('currency.details', { from: currency, to: currencies.defaultCurrency })}</p>

				<form onSubmit={(e) => onSubmitHandler(e, handleSubmit)}>
					<div className='w-full mt-5 md:flex justify-center  '>
						<FormInput
							label={t('currency.formRate')}
							altLabel={t('currency.formRateAlt', { from: currency, to: currencies.defaultCurrency })}
							error={hasError('rate')}
						>
							<FormInput.Group>
								<span>{`${currency.toUpperCase()}/${currencies.defaultCurrency.toUpperCase()}`}</span>
								<FormInput.Text name='rate' value={formState.rate} onChange={onChangeHandler} filter='number' />
								<button type='submit' className='btn btn-primary'>
									{t('buttons.save')}
								</button>
							</FormInput.Group>
						</FormInput>
					</div>
				</form>

				<div className='mt-5 w-full lg:w-4/6 lg:mx-auto'>
					<CurrencyChart
						data={currencies.getRateFor({ from: currency, history: 6 })}
						from={currency}
						to={currencies.defaultCurrency}
					/>
				</div>
			</Card>
		</>
	);
}
