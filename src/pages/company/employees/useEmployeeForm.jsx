import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useCompanyEmployees from '../../../context/company/useCompanyEmployees';
import useConfig from '../../../hooks/app/useConfig';
import useDateFns from '../../../hooks/common/useDateFns';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useEmployeeForm(employee = null) {
	//Dependencies
	const { t } = useTranslation('pages/company');
	const config = useConfig();
	const departments = config.get('company.departments');
	const currencies = config.getCurrenciesArray();
	const { datePickerJoiFormat } = useDateFns();
	const navigate = useNavigate();

	//Default employee data
	const { defaultEmployee } = useCompanyDefaults();
	//Employee model
	const { actions } = useCompanyEmployees();

	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);

	//=============// Form Builder //===============//
	const { schema, joi, register, getError, getFormData, resetForm } = useFormBuilder({
		initialState: employee ? employee : defaultEmployee,
		isSubmitted,
	});

	//=============// Form Schema //===============//
	addSchemaRules(schema, joi, { t, datePickerJoiFormat, currencies, departments });

	//=============// Form Handlers //===============//
	const onSubmit = (e) => {
		try {
			const data = getFormData(true);
			if (employee) {
				actions.update(data, () => navigate('/company/employees'));
			} else {
				actions.add(data, () => navigate('/company/employees'));
			}
		} catch (err) {
			//Form errors.
		}
	};
	const onDelete = () => {
		if (employee) {
			actions.delete(employee, () => navigate('/company/employees'));
		}
	};
	const onReset = (e) => {
		resetForm();
		setSubmitted(false);
	};

	//=============// Hook Exports //===============//
	return {
		register,
		getError,

		handlers: {
			submit: onSubmit,
			reset: onReset,
			delete: onDelete,
			setSubmitted: setSubmitted,
		},
		//Data for form select items
		selectData: {
			departments: departments.map((item) => ({ name: t(`departments.${item.name}`), value: item.name })),
			currencies: config.getLocalizedCurrencies({ longNames: true, symbols: true }),
		},
	};
} //End of hook

//=========================// SCHEMA //==========================//
function addSchemaRules(schema = null, joi = null, other = {}) {
	const onError = (dependency = null) => {
		console.log(`Missing dependency (${dependency}) for employee schema`);
		return schema;
	};
	//Extract required data
	const { t, datePickerJoiFormat, currencies, departments } = other;
	if (typeof t !== 'function') return onError('translation');
	if (typeof datePickerJoiFormat !== 'string') return onError('dateFormat');
	if (!Array.isArray(currencies)) return onError('currencies');
	if (!Array.isArray(departments)) return onError('departments');
	if (!schema) return onError('schema');
	if (!joi) return onError('joi');

	//=============// Form Schema //===============//
	//Strings
	schema.name = joi.string().min(3).max(100).required().label(t('employee.name'));
	schema.notes = joi.string().max(500).allow('').label(t('employee.notes'));
	schema.mobile = joi.string().allow('').max(30).label(t('employee.mobile'));
	schema.email = joi
		.string()
		.regex(/^\w+([.-]?\w+)+@\w+([.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/, { name: 'email' })
		.label(t('employee.email'));
	schema.dob = joi.date().format(datePickerJoiFormat).required().label(t('employee.dob'));
	schema.doe = joi.date().format(datePickerJoiFormat).required().label(t('employee.doe'));
	//Money
	schema.gross = joi.number().min(0).default(0).required().label(t('employee.gross'));
	schema.net = joi.number().min(0).default(0).required().label(t('employee.net'));
	//Enums
	schema.currency = joi
		.string()
		.allow(...currencies)
		.label(t('employee.currency'));
	schema.department = joi
		.string()
		.allow(...departments)
		.label(t('employee.department'));

	return schema;
}
