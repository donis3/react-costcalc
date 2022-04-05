import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/forms/Form';
import useCompany from '../../../context/company/useCompany';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function CompanyEdit({ handleClose = null }) {
	const { t } = useTranslation('pages/company');
	const { company, CompanyInfoActions } = useCompany();

	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);
	const initialState = { ...company.info };

	//=============// Form Builder //===============//
	const { schema, joi, register, getError, getFormData, setValue } = useFormBuilder({
		initialState,
		isSubmitted,
	});

	//=============// Form Schema //===============//
	schema.name = joi.string().min(3).max(100).required().label(t('company.name'));
	schema.founder = joi.string().min(3).max(100).required().label(t('company.founder'));
	schema.establishedOn = joi.number().required().label(t('company.establishedOn'));

	//=============// Form Handlers //===============//
	const handleSubmit = (e) => {
		try {
			const data = getFormData(false);
			CompanyInfoActions.updateInfo(data, handleClose);
		} catch (err) {
			//Form errors.
		}
	};

	const handleReset = () => {
		Object.keys(initialState).forEach((key) => {
			setValue(key, initialState[key]);
		});
	};

	const handleDelete = () => CompanyInfoActions.deleteInfo(handleClose);

	//=============// Form Render //===============//
	return (
		<Form onSubmit={handleSubmit} onReset={handleReset} onDelete={handleDelete} setSubmitted={setSubmitted}>
			{/* Details Section */}
			<Form.Section title={t('infoForm.details')}>
				{/* name */}
				<Form.Control label={t('company.name')} error={getError('name')}>
					<Form.Text {...register({ field: 'name', isControlled: false })} />
				</Form.Control>

				{/* Founder */}
				<Form.Control label={t('company.founder')} error={getError('founder')}>
					<Form.Text {...register({ field: 'founder', isControlled: false })} />
				</Form.Control>

                {/* Established On */}
				<Form.Control label={t('company.establishedOn')} error={getError('establishedOn')}>
					<Form.Text {...register({ field: 'establishedOn', isControlled: false })} />
				</Form.Control>
                tdo: react-datepicker https://github.com/gpbl/react-day-picker
			</Form.Section>
		</Form>
	);
}
