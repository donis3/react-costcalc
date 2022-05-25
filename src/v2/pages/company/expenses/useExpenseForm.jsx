import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useCompanyExpenseActions from '../../../context/company/useCompanyExpenseActions';
import useCompanyExpenseCalculator from '../../../context/company/useCompanyExpenseCalculator';
import useConfig from '../../../hooks/app/useConfig';
import useMoney from '../../../hooks/app/useMoney';
import useFormBuilder from '../../../hooks/forms/useFormBuilder';

export default function useExpenseForm(expense = null) {
	const config = useConfig();
	const navigate = useNavigate();
	const { t } = useTranslation('pages/company', 'translation');
	const { periods, units, defaultExpense, expenseCategories } = useCompanyDefaults();
	const selectData = useSelectArray({ units, periods, expenseCategories });
	const { enabledCurrencies } = useMoney();
	const { calculateCost, defaultCost } = useCompanyExpenseCalculator();
	const actions = useCompanyExpenseActions();

	//=============// Form State //===============//
	const [isSubmitted, setSubmitted] = useState(false);
	//State for ux
	const initialCostData = expense ? calculateCost(expense) : defaultCost;
	const [cost, setCost] = useState(initialCostData);

	//=============// Form Builder //===============//
	const { schema, joi, register, getError, getFormData, resetForm, getValue, handleChange } = useFormBuilder({
		initialState: expense ? expense : defaultExpense,
		isSubmitted,
	});
	//=============// Form Schema //===============//
	addSchemaRules(schema, joi, { t, currencies: enabledCurrencies, units, periods, expenseCategories });

	//=============// Form Handlers //===============//
	const onSubmit = (e) => {
		try {
			const data = getFormData(true);
			if (expense) {
				actions.update(data, () => navigate('/company/expenses'));
			} else {
				//actions.add(data, () => navigate('/company/employees'));
				actions.add(data, navigate('/company/expenses'));
			}
		} catch (err) {
			//Form errors.
		}
	};
	const onDelete = () => {
		if (expense) {
			actions.delete(expense, () => navigate('/company/expenses'));
		}
	};
	const onReset = (e) => {
		resetForm();
		setSubmitted(false);
		setCost(initialCostData);
	};
	//=========================// Cost Calculation //==========================//
	const getCostValues = () => {
		return {
			period: getValue('period'),
			price: getValue('price'),
			quantity: getValue('quantity'),
			tax: getValue('tax'),
			currency: getValue('currency'),
		};
	};
	const handlePriceChange = () => {
		const expenseData = getCostValues();
		const costData = calculateCost(expenseData);
		setCost(costData);
	};
	//Event listeners
	handleChange('period', handlePriceChange);
	handleChange('price', handlePriceChange);
	handleChange('currency', handlePriceChange);
	handleChange('quantity', handlePriceChange);
	handleChange('tax', handlePriceChange);
	//=========================// EXPORTS //==========================//
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
		cost,
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
	const { selectCurrencyArray } = useMoney();

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
		currencies: selectCurrencyArray(),
	};
}

//=========================// SCHEMA //==========================//
function addSchemaRules(schema = null, joi = null, other = {}) {
	const onError = (dependency = null) => {
		console.log(`Missing dependency (${dependency}) for expense schema`);
		return schema;
	};
	//Extract required data
	const { t, units, periods, currencies, expenseCategories } = other;
	if (typeof t !== 'function') return onError('translation');
	if (!Array.isArray(currencies)) return onError('currencies');
	if (!Array.isArray(units)) return onError('units');
	if (!Array.isArray(periods)) return onError('periods');
	if (!Array.isArray(expenseCategories)) return onError('expenseCategories');
	if (!schema) return onError('schema');
	if (!joi) return onError('joi');

	//=============// Form Schema //===============//
	//Strings
	schema.name = joi.string().min(3).max(100).required().label(t('expense.name'));
	//Selects
	schema.category = joi
		.string()
		.allow(...expenseCategories)
		.label(t('expense.category'));
	schema.period = joi
		.string()
		.allow(...periods)
		.label(t('expense.period'));
	schema.currency = joi
		.string()
		.allow(...currencies)
		.label(t('expense.currency'));
	schema.unit = joi
		.string()
		.allow(...units)
		.label(t('expense.unit'));

	//Numbers
	schema.price = joi.number().min(0).default(0).required().label(t('expense.price'));
	schema.quantity = joi.number().min(0).default(0).required().label(t('expense.quantity'));
	schema.tax = joi.number().min(0).default(0).required().label(t('expense.tax'));

	return schema;
}
