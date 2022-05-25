import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import { validate, version } from 'uuid';
import useCompanyDefaults from './useCompanyDefaults';

import { CompanyContext } from '.';
import useMoney from '../../hooks/app/useMoney';
const validateId = (id) => validate(id) && version(id) === 4;

export default function useCompanyExpenses() {
	const company = useContext(CompanyContext);
	const { expenseCategories } = useCompanyDefaults();
	const { t } = useTranslation('pages/company', 'translation');
	const { convert, defaultCurrency } = useMoney();

	//=============================// Definitions //=============================//
	const sortingSchema = {
		expenseId: 'unsorted',
		name: 'string',
		category: 'string',
		period: 'string',
		currency: 'string',
		unit: 'string',
		price: 'numeric',
		quantity: 'numeric',
		tax: 'numeric',
		//Calculated Fields
		localAnnualCost: 'numeric',
		localAnnualCostWithTax: 'numeric',
		localCategory: 'string',
		localPeriod: 'string',
	};

	function findById(expenseId = null) {
		if (!validateId(expenseId)) return null;
		if (!Array.isArray(company?.expenses)) return null;
		const expense = company.expenses.find((item) => item.expenseId === expenseId);
		return expense ? expense : null;
	}

	function getAll({ field = 'expenseId', asc = true, category = null } = {}) {
		if (!Array.isArray(company?.expenses)) return [];

		//Filter (All by default)
		let filter = [];
		//Filter category
		if (category) {
			if (expenseCategories.includes(category)) filter.push(category);
			if (Array.isArray(category)) {
				filter = category.filter((item) => expenseCategories.includes(item));
			}
		}
		//IF a category filter is not specified, return all
		let filteredExpenses = company.expenses;
		if (filter.length > 0) {
			filteredExpenses = company.expenses.filter((item) => filter.includes(item.category));
		}

		//Add cost calc in local currency and other localizations
		const convertedExpenses = filteredExpenses.map((item) => {
			//Default item
			const result = { ...item, localAnnualCost: 0, localAnnualCostWithTax: 0 };
			//Localizations
			result.localPeriod = t(`periods.${item.period}`, { ns: 'translation' });
			result.localCategory = t(`expenseCategories.${item.category}`);

			//Cost localizations
			if (!item?.cost?.y) return result;
			//Extract data
			const { amount, amountWithTax, currency } = item?.cost?.y;
			//Non converted result
			result.localAnnualCost = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
			result.localAnnualCostWithTax = isNaN(parseFloat(amountWithTax)) ? 0 : parseFloat(amountWithTax);
			//No conversion needed
			if (currency === defaultCurrency) return result;
			//Conversion required
			result.localAnnualCost = convert(amount, currency).amount;
			result.localAnnualCostWithTax = convert(amountWithTax, currency).amount;

			return result;
		});

		//Return sorted
		if (field in sortingSchema && sortingSchema[field] === 'numeric') {
			return sortArrayNumeric(convertedExpenses, field, asc);
		}
		if (field in sortingSchema && sortingSchema[field] === 'string') {
			return sortArrayAlphabetic(convertedExpenses, field, asc);
		}

		//Unsorted by default
		return convertedExpenses;
	}

	/**
	 * Generate an array of categories with at least 1 expense item in it.
	 * @returns array of categories
	 */
	const getAvailableCategories = () => {
		return company.expenses.reduce((acc, expense) => {
			const { category } = expense;
			if (acc.includes(category)) {
				return acc;
			} else {
				return [...acc, category];
			}
		}, []);
	};

	return {
		findById,
		getAll,
		getAvailableCategories,
		sorting: {
			fields: ['expenseId', 'name', 'localCategory', 'localPeriod', 'localAnnualCost'],
			default: 'expenseId',
		},
	};
}
