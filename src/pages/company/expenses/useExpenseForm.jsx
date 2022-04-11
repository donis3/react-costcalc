import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useConfig from '../../../hooks/app/useConfig';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useExpenseForm(expense = null) {
	const config = useConfig();
	const { t } = useTranslation('pages/company', 'translation');
	const { periods, units, defaultExpense, expenseCategories } = useCompanyDefaults();
	const selectData = useSelectArray({ units, periods, expenseCategories });
	const currencies = config.getCurrenciesArray();

	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);

	//=============// Form Builder //===============//
	const { schema, joi, register, getError, getFormData, resetForm } = useFormBuilder({
		initialState: expense ? expense : defaultExpense,
		isSubmitted,
	});
	//=============// Form Schema //===============//
	addSchemaRules(schema, joi, { t, currencies, units, periods });

	//=============// Form Handlers //===============//
	const onSubmit = (e) => {
		try {
			const data = getFormData(true);
			if (expense) {
				//actions.update(data, () => navigate('/company/employees'));
				console.log('Implement update');
			} else {
				//actions.add(data, () => navigate('/company/employees'));
				console.log('Implement add');
			}
		} catch (err) {
			//Form errors.
		}
	};
	const onDelete = () => {
		if (expense) {
			//actions.delete(employee, () => navigate('/company/employees'));
			console.log('Implement onDelete');
		}
	};
	const onReset = (e) => {
		resetForm();
		setSubmitted(false);
	};

	return {
		register,
		getError,
		handlers: {
			submit: onSubmit,
			reset: onReset,
			delete: onDelete,
			setSubmitted: setSubmitted,
		},
		selectData,
	};
}

//=========================// Helpers //==========================//
/**
 * Generate arrays for form selects using localized text
 * @param {*} data units array and periods array
 * @returns
 */
function useSelectArray({ units, periods, expenseCategories }) {
	const { t } = useTranslation('pages/company', 'translation');
	const config = useConfig();

	let unitsSelect = [];
	let periodsSelect = [];
	let categioriesSelect = [];
	if (Array.isArray(units) && units.length > 0) {
		unitsSelect = units.map((item) => {
			return { name: t(`units.${item}`, { ns: 'translation' }), value: item };
		});
	}
	if (Array.isArray(periods) && periods.length > 0) {
		periodsSelect = periods.map((item) => {
			return { name: t(`periods.${item}`, { ns: 'translation' }), value: item };
		});
	}

	if (Array.isArray(expenseCategories) && expenseCategories.length > 0) {
		categioriesSelect = expenseCategories.map((item) => {
			return { name: t(`expenseCategories.${item}`), value: item };
		});
	}

	return {
		unit: unitsSelect,
		period: periodsSelect,
		category: categioriesSelect,
		currencies: config.getLocalizedCurrencies({ longNames: true, symbols: true }),
	};
}

//=========================// SCHEMA //==========================//
function addSchemaRules(schema = null, joi = null, other = {}) {
	const onError = (dependency = null) => {
		console.log(`Missing dependency (${dependency}) for expense schema`);
		return schema;
	};
	//Extract required data
	const { t, units, periods, currencies } = other;
	if (typeof t !== 'function') return onError('translation');
	if (!Array.isArray(currencies)) return onError('currencies');
	if (!Array.isArray(units)) return onError('units');
	if (!Array.isArray(periods)) return onError('periods');
	if (!schema) return onError('schema');
	if (!joi) return onError('joi');

	//=============// Form Schema //===============//
	//Strings
	schema.name = joi.string().min(3).max(100).required().label(t('employee.name'));
	schema.notes = joi.string().max(500).allow('').label(t('employee.notes'));
	schema.mobile = joi.string().allow('').max(30).label(t('employee.mobile'));

	//Money
	schema.gross = joi.number().min(0).default(0).required().label(t('employee.gross'));
	schema.net = joi.number().min(0).default(0).required().label(t('employee.net'));
	//Enums
	schema.currency = joi
		.string()
		.allow(...currencies)
		.label(t('employee.currency'));
	return schema;
}
