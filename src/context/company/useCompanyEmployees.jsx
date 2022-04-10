import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyContext } from '../CompanyContext';
import useCompanyToaster from './useCompanyToaster';
import { validate, version } from 'uuid';
const validateId = (id) => validate(id) && version(id) === 4;

export default function useCompanyEmployees() {
	const [company, dispatch] = useContext(CompanyContext);
	const { successToast, errorToast } = useCompanyToaster();
	const { t } = useTranslation('pages/company');

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

	return {
		employees: company.employees,
		findById,
		actions: {
			removeAll: resetEmployees,
			add: addEmployee,
			update: updateEmployee,
		},
	};
}
