import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Form from '../../components/forms/Form';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import { toast } from 'react-toastify';

import useSettings from '../../context/settings/useSettings';

import useSettingsForm from './useSettingsForm';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { AiFillStar as FavSelectedIcon, AiOutlineStar as FavIcon } from 'react-icons/ai';

import { useNavigate } from 'react-router-dom';
import DocumentDates from '../../components/common/DocumentDates';
import { SettingsDispatchContext } from '../../context/settings';

export default function Settings() {
	const { t } = useTranslation('pages/settings');
	const navigate = useNavigate();
	const { settings, setupComplete } = useSettings();
	const dispatch = useContext(SettingsDispatchContext);
	const { select, register, actions, formState, showApiSection, isApiKeyDisabled, getError, defaultCurrencyName } =
		useSettingsForm({
			data: settings,
		});

	useEffect(() => {
		if (settings?.updatedAt && settings.updatedAt > 1) {
			const timeDiff = Date.now() - settings.updatedAt;
			if (timeDiff < 500) {
				//Update success, navigate home
				navigate('/');
			}
		}
	}, [settings?.updatedAt, navigate]);

	//Healthchecks
	useEffect(() => {
		const success = () => toast.warning(t('error.MissingApi'), { toastId: 'settings' });
		dispatch({ type: 'ApiHealthCheck', success });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Card className='w-full px-3 py-5' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={setupComplete ? t('title') : t('titleInitial')} module='settings' role='main' />

				{/* Form Start */}
				<Form onSubmit={actions.handleSubmit} onReset={actions.handleReset} setSubmitted={actions.setIsSubmitted}>
					{/* Remote Api Section */}
					{showApiSection && (
						<Form.Section title={t('form.titleXrate')}>
							<Form.Control label={t('form.api')} altLabel={t('form.apiAlt')} error={getError('api')}>
								<Form.Select options={select.api} {...register({ field: 'api', isControlled: true })} />
							</Form.Control>
							<Form.Control label={t('form.apiKey')} altLabel={t('form.apiKeyAlt')} error={getError('apiKey')}>
								<Form.Text
									name='apiKey'
									disabled={isApiKeyDisabled}
									{...register({ field: 'apiKey', isControlled: false })}
								/>
							</Form.Control>
						</Form.Section>
					)}
					{/* Currency Options */}
					<Form.Section title={t('form.titleCurrency')}>
						{/* Warning Text */}
						{setupComplete ? <Alert>{t('warning')}</Alert> : <Alert info>{t('warningInitialSetup')}</Alert>}

						<Form.Control
							label={t('form.defaultCurrency')}
							altLabel={setupComplete ? t('form.cantChange') : t('form.defaultCurrencyAlt')}
							error={getError('defaultCurrency')}
						>
							{setupComplete ? (
								<Form.Text disabled name='defaultCurrency' value={defaultCurrencyName} />
							) : (
								<Form.Select
									name='defaultCurrency'
									options={select.defaultCurrency}
									{...register({ field: 'defaultCurrency', isControlled: true })}
								/>
							)}
						</Form.Control>
						<Form.Row>
							<Form.Control label={t('form.currency')} altLabel={t('form.currencyAlt')}>
								<Form.Select
									name='currencies'
									defaultValue={select.currencies[0].value}
									options={select.currencies}
									onSelect={actions.onCurrencySelect}
									disabled={formState.defaultCurrency === ''}
								/>
							</Form.Control>
							<Form.Control
								label={t('form.selectedCurrencies')}
								altLabel={t('form.selectedCurrenciesAlt')}
								error={getError('currencies')}
							>
								<div className='w-full min-h-12 bg-base-200 p-3 rounded-md flex flex-wrap gap-3'>
									{formState.currencies.map((cur) => {
										return (
											<SelectedCurrency
												name={cur}
												key={cur}
												onRemove={() => actions.removeCurrency(cur)}
												isFavorite={formState.favoriteCurrencies.includes(cur)}
												toggleFavorite={() => actions.toggleFavorite(cur)}
											/>
										);
									})}
								</div>
							</Form.Control>
						</Form.Row>
					</Form.Section>
				</Form>
			</Card>
			<DocumentDates
				updatedAt={settings?.updatedAt}
				createdAt={settings?.setupComplete}
				createdText={t('initialSetup')}
				showTimeSinceUpdate
			/>
		</>
	);
}

function SelectedCurrency({ name = '', onRemove = null, isFavorite = false, toggleFavorite = null }) {
	return (
		<div className='border rounded-md flex items-center '>
			<span className='py-1 px-2 bg-base-100 rounded-l-md font-semibold text-xs'>{name}</span>
			{isFavorite ? (
				<button type='button' className='p-1 h-full bg-base-100 border-l text-orange-500' onClick={toggleFavorite}>
					<FavSelectedIcon />
				</button>
			) : (
				<button
					type='button'
					className='p-1 h-full bg-base-100 border-l  hover:text-orange-500'
					onClick={toggleFavorite}
				>
					<FavIcon />
				</button>
			)}
			<button type='button' className='p-1 h-full rounded-r-md border-l  hover:bg-base-300' onClick={onRemove}>
				<FaTimes />
			</button>
		</div>
	);
}

function Alert({ children, info = false }) {
	return (
		<div className={`alert ${info ? 'alert-info' : 'alert-warning'}`}>
			<div className='gap-5'>
				<FaExclamationTriangle className='min-w-fit text-xl' />
				<span>{children}</span>
			</div>
		</div>
	);
}
