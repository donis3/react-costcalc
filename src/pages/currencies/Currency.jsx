import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import FormInput from '../../components/form/FormInput';
import { useCurrencyContext, useCurrencyDispatch } from '../../context/MainContext';
import useFormHandler from '../../hooks/common/useFormHandler';
import useIntl from '../../hooks/common/useIntl';
import useJoi from '../../hooks/common/useJoi';
import NotFound from '../NotFound';
import CurrencyError from './CurrencyError';

export default function Currency() {
	const { t } = useTranslation();
	const { currency } = useParams();
	const { currencies } = useCurrencyContext();
	const { dispatch } = useCurrencyDispatch();
	const Joi = useJoi();
	const [formState, setFormState] = useState({ rate: 0 });
	const schema = Joi.object({
		rate: Joi.number().min(0).required().label(t('currency.formRate')),
	});
	const { hasError, onChangeHandler, onSubmitHandler } = useFormHandler({ formState, setFormState, schema });

	useEffect(() => {
		setFormState({ rate: currencies.getCurrentRate(currency) });
	}, [currency, currencies]);

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
					{t('currency.titlePair', { from: currency, to: currencies.defaultCurrency })}
				</h3>
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
				<div className='w-full mt-10 font-light'>
					<h3 className='text-sm font-medium my-1'>{t('currency.historyTitle')}</h3>
					<CurrencyHistory data={currencies.getRateFor({ from: currency, history: 100 })} />
				</div>
			</Card>
		</>
	);
}

function CurrencyHistory({ data = null } = {}) {
	const { t } = useTranslation();
	const { displayNumber, displayDate } = useIntl();

	//No data available
	if (!data || data.history.length === 0) {
		return <>{t('currency.historyNoData')}</>;
	}

	//Show table
	return (
		<table className='table w-full table-zebra table-compact font-normal'>
			<thead>
				<tr>
					<th className='w-1/12'>#</th>
					<th className='w-4/12'>{t('fields.date')}</th>
					<th className='w-7/12'>{t('fields.rate')}</th>
				</tr>
			</thead>
			<tbody>
				{data.history.map((item, index) => {
					return (
						<tr key={index}>
							<th className='font-light'>{index}</th>
							<td>{displayDate(item.date)}</td>
							<td>{displayNumber(item.rate, 2)}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
