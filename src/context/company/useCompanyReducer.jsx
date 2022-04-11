import useCompanyDefaults from './useCompanyDefaults';
import { v4 as uuid4, validate as validateId } from 'uuid';

export default function useCompanyReducer() {
	//Dependencies
	const { defaultCompany, defaultEmployee } = useCompanyDefaults();

	//Start reducer
	function companyReducer(state, action) {
		if (typeof action !== 'object' || 'type' in action === false) action = {};
		const { type = null, payload = null, success = null, error = null } = action;

		//CALLBACKS
		function onSuccess(newState) {
			if (typeof success === 'function') success();
			return newState;
		}

		function onError(errCode = null) {
			if (typeof error === 'function') error(errCode);
			return state;
		}

		//ACTIONS
		switch (type) {
			case 'add': {
				return onError();
			}

			/**
			 * Requires a payload of company info object
			 * Will merge it with current company info state and update if necessary
			 */
			case 'UpdateCompanyInfo': {
				//Verify
				if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
					return onError('invalidData');
				}
				//Merge
				const newInfo = { ...state.info, ...payload };
				//Compare
				if (JSON.stringify(newInfo) === JSON.stringify(state.info)) {
					return onError('updateNotRequired');
				}
				//Update
				return onSuccess({ ...state, info: newInfo });
			}

			/**
			 * Removes all company information and reverts to default values
			 */
			case 'ResetCompanyInfo': {
				//Verify
				if (!defaultCompany || typeof defaultCompany !== 'object' || 'info' in defaultCompany === false) {
					//Default company data is invalid
					return onError('invalidData');
				}
				//Compare
				if (JSON.stringify(defaultCompany.info) === JSON.stringify(state?.info)) {
					//State info and default info are the same, no need to update
					return onError('updateNotRequired');
				}
				//Update
				return onSuccess({ ...state, info: defaultCompany.info });
			}

			/**
			 * Removes all company information and reverts to default values
			 */
			case 'ResetEmployees': {
				//Update
				return onSuccess({ ...state, employees: [] });
			}

			/**
			 * Add new employee to company.employees
			 */
			case 'AddEmployee': {
				//Verify
				if (!payload || typeof payload !== 'object' || 'name' in payload === false) {
					return onError('invalidData');
				}
				//merge with default employee
				const newEmployee = { ...defaultEmployee, ...payload };
				//Check duplicate
				if (
					Array.isArray(state?.employees) &&
					state.employees.length > 0 &&
					'email' in newEmployee &&
					newEmployee.email.length > 0
				) {
					if (state.employees.find((employee) => employee.email === newEmployee.email)) {
						//Found duplicate
						return onError('duplicate');
					}
				}
				//Add uuid
				newEmployee.employeeId = uuid4();

				//Add to state
				return onSuccess({ ...state, employees: [...state.employees, newEmployee] });
			}

			/**
			 * Add new employee to company.employees
			 */
			case 'UpdateEmployee': {
				//Verify
				if (!payload || typeof payload !== 'object' || !validateId(payload?.employeeId)) {
					return onError('invalidData');
				}
				//Find requested employee
				if (!Array.isArray(state.employees)) return onError('badRequest');
				const employee = state.employees.find((item) => item.employeeId === payload.employeeId);
				if (!employee) return onError('updateTargetNotFound');

				//Merge
				const newEmployee = { ...employee, ...payload };

				//Compare
				if (JSON.stringify(newEmployee) === JSON.stringify(employee)) {
					//Nothing to update.
					return onError('updateNotRequired');
				}
				//Update state
				return onSuccess({
					...state,
					employees: state.employees.map((item) => {
						if (item.employeeId !== newEmployee.employeeId) return item;
						return newEmployee;
					}),
				});
			}

			/**
			 * Add new employee to company.employees
			 */
			case 'DeleteEmployee': {
				//Verify
				if (!payload || typeof payload !== 'object' || !validateId(payload?.employeeId)) {
					return onError('invalidData');
				}
				//Find requested employee
				if (!Array.isArray(state.employees)) return onError('badRequest');
				const employee = state.employees.find((item) => item.employeeId === payload.employeeId);
				if (!employee) return onError('nameNotFound');

				//Remove employee and return
				return onSuccess({
					...state,
					employees: state.employees.filter((item) => item.employeeId !== employee.employeeId),
				});
			}

			// Unsupported Dispatch Type
			default: {
				throw new Error('Invalid action type received: ' + type);
			}
		}
	} //End of reducer

	//Exports
	return companyReducer;
}
