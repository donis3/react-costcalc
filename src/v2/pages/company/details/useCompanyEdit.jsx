import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useCompanyInfo from '../../../context/company/useCompanyInfo';
import useDateFns from '../../../hooks/common/useDateFns';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useCompanyEdit({ formCallback = null }) {
	const { t } = useTranslation('pages/company');
	const { info, actions } = useCompanyInfo();
	const { datePickerJoiFormat } = useDateFns();

	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);
	const initialState = { ...info };

	//=============// Form Builder //===============//
	const { schema, joi, register, getError, getFormData, setValue } = useFormBuilder({
		initialState,
		isSubmitted,
	});

	//=============// Form Schema //===============//
	schema.name = joi.string().min(3).max(100).required().label(t('company.name'));
	schema.legalName = joi.string().min(3).max(250).required().label(t('company.legalName'));
	schema.founder = joi.string().min(3).max(100).required().label(t('company.founder'));
	schema.establishedOn = joi.date().format(datePickerJoiFormat).required().label(t('company.establishedOn'));
	schema.about = joi.string().max(1000).required().label(t('company.about'));
	schema.taxId = joi.string().allow('').max(100).label(t('company.taxId'));
	schema.website = joi.string().optional().allow('').uri().label(t('company.website'));

	schema.address = joi.string().allow('').max(300).label(t('company.address'));
	schema.city = joi.string().allow('').max(100).label(t('company.city'));
	schema.country = joi.string().allow('').max(100).label(t('company.country'));
	schema.email = joi
		.string()
		.regex(/^\w+([.-]?\w+)+@\w+([.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/, { name: 'email' })
		.label(t('company.email'));
	schema.phone = joi.string().allow('').max(30).label(t('company.phone'));
	schema.fax = joi.string().allow('').max(30).label(t('company.fax'));
	schema.mobile = joi.string().allow('').max(30).label(t('company.mobile'));
	//=============// Form Handlers //===============//
	const handleSubmit = (e) => {
		try {
			const data = getFormData(false);
			actions.updateInfo(data, formCallback);
		} catch (err) {
			//Form errors.
		}
	};

	const handleReset = () => {
		Object.keys(initialState).forEach((key) => {
			setValue(key, initialState[key]);
		});
		setSubmitted(false);
	};

	const handleDelete = () => actions.deleteInfo(formCallback);

	return {
		register,
		getError,

		handlers: {
			submit: handleSubmit,
			reset: handleReset,
			delete: handleDelete,
			setSubmitted: setSubmitted,
		},
	};
}
