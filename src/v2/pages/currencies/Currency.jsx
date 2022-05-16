import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import FormInput from '../../components/form/FormInput';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useApp from '../../context/app/useApp';
import useCurrency from '../../context/currency/useCurrency';
import useJoi from '../../hooks/common/useJoi';
import useFormHandler from '../../hooks/common/useFormHandler';
import { CurrencyDispatchContext } from '../../context/currency';
import CurrencyChart from './components/CurrencyChart';

export default function Currency() {
	const { currency } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation('translation', 'pages/currency');
	const { page } = useApp();
	const { currencies, rates, getName } = useCurrency();
	const dispatch = useContext(CurrencyDispatchContext);

	const rateHistory = rates?.[currency] ? [...rates?.[currency]] : [];

	useEffect(() => {
		page.setBreadcrumb(getName(currency));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!Array.isArray(currencies?.enabled) || !currencies.enabled.includes(currency)) {
			toast.error(t('error.InvalidCurrency', { ns: 'pages/currency' }));
			navigate('/currency');
		}
	}, [currency, currencies?.enabled, navigate, t]);

	//====================// Handle New Rate Form //=========================//
	const Joi = useJoi();
	const [formState, setFormState] = useState({ rate: 0 });
	const schema = Joi.object({
		rate: Joi.number().min(0).positive().required().label(t('currency.formRate')),
	});
	const { hasError, onChangeHandler, onSubmitHandler } = useFormHandler({ formState, setFormState, schema });
	const handleSubmit = (data) => {
		//new conversion rate submitted, handle it
		if (!data) return;

		//Create payload for dispatch
		const payload = { from: currency, to: currencies.default, rate: data.rate };
		const success = () =>
			toast.success(t('currency.addSuccess', { from: currency, to: currencies.default }), {
				toastId: 'currencySuccess',
			});
		const error = (code) => toast.error(t('currency.addError', { code }), { toastId: 'currency' });
		dispatch({ type: 'AddRate', payload, success, error });
	};

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader
					text={t('currency.titleCurrency', { currency: getName(currency) })}
					module='currency'
					role='view'
				/>
				{/* Details text about this module */}
				<p className='opacity-80'>{t('currency.details', { from: currency, to: currencies.default })}</p>

				<form onSubmit={(e) => onSubmitHandler(e, handleSubmit)}>
					<div className='w-full mt-5 md:flex justify-center  '>
						<FormInput
							label={t('currency.formRate')}
							altLabel={t('currency.formRateAlt', { from: currency, to: currencies.default })}
							error={hasError('rate')}
						>
							<FormInput.Group>
								<span>{`${currency.toUpperCase()}/${currencies.default.toUpperCase()}`}</span>
								<FormInput.Text name='rate' value={formState.rate} onChange={onChangeHandler} filter='number' />
								<button type='submit' className='btn btn-primary'>
									{t('buttons.save')}
								</button>
							</FormInput.Group>
						</FormInput>
					</div>
				</form>

				<div className='mt-5 w-full lg:w-4/6 lg:mx-auto'>
					<CurrencyChart data={rateHistory} from={currency} to={currencies.default} />
				</div>
			</Card>
		</>
	);
}
