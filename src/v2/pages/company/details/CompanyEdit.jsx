import React from 'react';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/forms/Form';
import useCompanyEdit from './useCompanyEdit';

export default function CompanyEdit({ handleClose = null }) {
	const { t } = useTranslation('pages/company');
	const { register, getError, handlers } = useCompanyEdit({ formCallback: handleClose });

	//=============// Form Render //===============//
	return (
		<Form
			onSubmit={handlers.submit}
			onReset={handlers.reset}
			onDelete={handlers.delete}
			setSubmitted={handlers.setSubmitted}
		>
			{/* Details Section */}
			<Form.Section title={t('infoForm.details')}>
				{/* name */}
				<Form.Control label={t('company.name')} error={getError('name')}>
					<Form.Text {...register({ field: 'name', isControlled: false })} />
				</Form.Control>

				{/* Legal Name */}
				<Form.Control label={t('company.legalName')} error={getError('legalName')}>
					<Form.Text {...register({ field: 'legalName', isControlled: false })} />
				</Form.Control>

				{/* Founder */}
				<Form.Control label={t('company.founder')} error={getError('founder')}>
					<Form.Text {...register({ field: 'founder', isControlled: false })} />
				</Form.Control>

				{/* Established On */}
				<Form.Control label={t('company.establishedOn')} error={getError('establishedOn')}>
					<Form.Date {...register({ field: 'establishedOn', isControlled: true })} />
				</Form.Control>

				{/* About */}
				<Form.Control label={t('company.about')} error={getError('about')}>
					<Form.Textarea {...register({ field: 'about', isControlled: false })} />
				</Form.Control>

				{/* Tax Id */}
				<Form.Control label={t('company.taxId')} error={getError('taxId')}>
					<Form.Text {...register({ field: 'taxId', isControlled: false })} />
				</Form.Control>

				{/* website */}
				<Form.Control label={t('company.website')} error={getError('website')}>
					<Form.Text
						{...register({ field: 'website', isControlled: false })}
						onClick={(e) => {
							if (e.target.value === '') {
								e.target.value = 'http://';
							}
						}}
					/>
				</Form.Control>
			</Form.Section>

			{/* Communications Section */}
			<Form.Section title={t('infoForm.communication')}>
				{/* Address */}
				<Form.Control label={t('company.address')} error={getError('address')}>
					<Form.Text {...register({ field: 'address', isControlled: false })} />
				</Form.Control>

				{/* City Country row */}
				<div className='flex flex-row  gap-x-5'>
					<Form.Control label={t('company.city')} error={getError('city')}>
						<Form.Text {...register({ field: 'city', isControlled: false })} />
					</Form.Control>
					<Form.Control label={t('company.country')} error={getError('country')}>
						<Form.Text {...register({ field: 'country', isControlled: false })} />
					</Form.Control>
				</div>

				{/* email */}
				<Form.Control label={t('company.email')} error={getError('email')}>
					<Form.Text {...register({ field: 'email', isControlled: false })} />
				</Form.Control>
				{/* phone */}
				<Form.Control label={t('company.phone')} error={getError('phone')}>
					<Form.Text {...register({ field: 'phone', isControlled: false })} />
				</Form.Control>
				{/* mobile */}
				<Form.Control label={t('company.mobile')} error={getError('mobile')}>
					<Form.Text {...register({ field: 'mobile', isControlled: false })} />
				</Form.Control>
				{/* fax */}
				<Form.Control label={t('company.fax')} error={getError('fax')}>
					<Form.Text {...register({ field: 'fax', isControlled: false })} />
				</Form.Control>
			</Form.Section>
		</Form>
	);
}
