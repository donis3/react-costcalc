import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyContext } from '../CompanyContext';
import useCompanyToaster from './useCompanyToaster';
import { validate, version } from 'uuid';
import useCurrencyConversion from '../../hooks/app/useCurrencyConversion';
import { isValid, parseISO } from 'date-fns';

import { sortArrayAlphabetic, sortArrayDate, sortArrayNumeric } from '../../lib/common';
const validateId = (id) => validate(id) && version(id) === 4;

export default function useCompanyEmployees() {
	const [company, dispatch] = useContext(CompanyContext);

	const { successToast, errorToast } = useCompanyToaster();
	const { t } = useTranslation('pages/company');
	const { convert, defaultCurrency } = useCurrencyConversion();

	//=============================// Definitions //=============================//
	const sortingSchema = {
		employeeId: 'string',
		name: 'string',
		department: 'string',
		dob: 'date',
		doe: 'date',
		gross: 'numeric', //sort grossLocal to be able to sort between currencies
		net: 'numeric',
		grossLocal: 'numeric',
	};
	const fieldType = (field) => (field in sortingSchema ? sortingSchema[field] : 'string');
	//=============================// ACTIONS //=============================//
	function addEmployee(data, callback) {
		const action = {
			type: 'AddEmployee',
			payload: data,
			success: successToast('add', data?.name),
			error: errorToast(),
		};
		dispatch(action);
		//Run callback after dispatch complete regardless of result
		callback?.();
	}

	function updateEmployee(data, callback) {
		const action = {
			type: 'UpdateEmployee',
			payload: data,
			success: successToast('update', data?.name),
			error: errorToast(null, t('employees.name')),
		};
		dispatch(action);
		//Run callback after dispatch complete regardless of result
		callback?.();
	}

	function deleteEmployee(data, callback) {
		const action = {
			type: 'DeleteEmployee',
			payload: data,
			success: successToast('delete', data?.name),
			error: errorToast(null, t('employees.name')),
		};
		dispatch(action);
		//Run callback after dispatch complete regardless of result
		callback?.();
	}

	/**
	 * For debug
	 * Removes all employees
	 */
	function resetEmployees() {
		const action = {
			type: 'ResetEmployees',
			success: successToast('reset', t('employees.moduleName')),
			error: errorToast(),
		};
		dispatch(action);
	}

	//=============================// CONTROLS //=============================//

	function findById(employeeId = null) {
		if (!validateId(employeeId)) return null;
		if (!Array.isArray(company.employees)) return null;
		return company.employees.find((employee) => employee.employeeId === employeeId);
	}

	function getAll({ field = 'employeeId', asc = false } = {}) {
		//Typecheck
		if (field in sortingSchema === false) field = 'employeeId';
		if (typeof asc !== 'boolean') asc = true;
		const sortType = fieldType(field);

		//Get all employees
		const employees = Array.isArray(company?.employees) ? company.employees : [];

		//Localize departments to be able to sort them. also add local currency wage
		const localizedEmployees = employees.map((emp) => {
			//Calculate local currency gross salary
			let grossLocal = parseFloat(emp.gross);
			if (emp.currency !== defaultCurrency) {
				grossLocal = convert(emp.gross, emp.currency, defaultCurrency).amount;
			}
			if (isNaN(grossLocal)) grossLocal = 0;

			//Parse date fields
			return {
				...emp,
				department: t(`departments.${emp.department}`),
				grossLocal,
				doe: isValid(emp.doe) ? emp.doe : parseISO(emp.doe),
				dob: isValid(emp.dob) ? emp.dob : parseISO(emp.dob),
			};
		});
		//Sort
		if (sortType === 'string') {
			return sortArrayAlphabetic(localizedEmployees, field, asc);
		}
		if (sortType === 'date') {
			return sortArrayDate(localizedEmployees, field, asc);
		}
		if (sortType === 'numeric') {
			return sortArrayNumeric(localizedEmployees, field, asc);
		}
		return localizedEmployees;
	}

	return {
		employees: company.employees,
		findById,
		getAll,
		actions: {
			removeAll: resetEmployees,
			add: addEmployee,
			update: updateEmployee,
			delete: deleteEmployee,
		},
		sorting: {
			fields: Object.keys(sortingSchema),
			default: 'employeeId',
		},
	};
}
