import useCompanyDefaults from './useCompanyDefaults';
import { v4 as uuid4, validate as validateId } from 'uuid';
import useCompanyExpenseCalculator from './useCompanyExpenseCalculator';

//Number of history items allowed
const historyMax = 20;

export default function useCompanyReducer() {
	//Dependencies
	const { defaultCompany, defaultEmployee, defaultExpense } = useCompanyDefaults();
	const { calculateCost } = useCompanyExpenseCalculator();

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

		//Check state keys and add missing defaults
		Object.keys(defaultCompany).forEach((key) => {
			if (key in state === false) {
				state[key] = defaultCompany[key];
			}
		});

		//ACTIONS
		switch (type) {
			//==========================// COMPANY INFO //==========================//

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

			//==========================// EMPLOYEES //==========================//

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
			 * Updates an employee. Expects an employee obj
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
			 * Delete an employee. Expects the employee object
			 */
			case 'DeleteEmployee': {
				//Verify
				if (!payload || typeof payload !== 'object' || !validateId(payload?.employeeId)) {
					return onError('deleteInvalidData');
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

			//==========================// EXPENSES //==========================//
			/**
			 * Adds an expense. Expects an expense obj
			 * Will generate UUID
			 */
			case 'AddExpense': {
				//Verify
				if (!payload || typeof payload !== 'object' || 'name' in payload === false) {
					return onError('addInvalidData');
				}
				//Merge & generate id
				const newExpense = { ...defaultExpense, ...payload, expenseId: uuid4() };

				//Calculate cost per period and save it to object (dont convert to local currency)
				newExpense.cost = calculateCost(newExpense, false);

				//Add to state
				return onSuccess({ ...state, expenses: [...state?.expenses, newExpense] });
			}

			/**
			 * Updates an expense. Expects an expense obj
			 */
			case 'UpdateExpense': {
				//Verify
				if (!payload || typeof payload !== 'object' || !validateId(payload?.expenseId)) {
					return onError('updateInvalidData');
				}
				//Find requested expense
				if (!Array.isArray(state.expenses)) return onError('badRequest');
				const expense = state.expenses.find((item) => item.expenseId === payload.expenseId);
				if (!expense) return onError('nameNotFound');

				//Merge received expense with existing
				const newExpense = { ...expense, ...payload };

				//Calculate cost per period and save it to object (dont convert to local currency)
				newExpense.cost = calculateCost(newExpense, false);

				//Compare
				if (JSON.stringify(newExpense) === JSON.stringify(expense)) {
					//Nothing to update.
					return onError('updateNotRequired');
				}
				//Update state
				return onSuccess({
					...state,
					expenses: state.expenses.map((item) => {
						if (item.expenseId !== newExpense.expenseId) return item;
						return newExpense;
					}),
				});
			}
			/**
			 * Delete an Expense. Expects an expense object
			 */
			case 'DeleteExpense': {
				//Verify
				if (!payload || typeof payload !== 'object' || !validateId(payload?.expenseId)) {
					return onError('deleteInvalidData');
				}
				//Find requested expense
				if (!Array.isArray(state.expenses)) return onError('badRequest');
				const expense = state.expenses.find((item) => item.expenseId === payload.expenseId);
				if (!expense) return onError('nameNotFound');

				//Remove expense and return
				return onSuccess({
					...state,
					expenses: state.expenses.filter((item) => item.expenseId !== expense.expenseId),
				});
			}

			//==========================// COMPANY TOTALS //==========================//
			/**
			 * Update company production data
			 */
			case 'UpdateCompanyProduction': {
				if (!payload || 'totalProduction' in payload === false) return onError('invalidData');
				if (JSON.stringify(state?.production) === JSON.stringify(payload)) {
					//Both data are the same, no need to update
					return state;
				}
				//Something changed, add to history
				let newProductionHistory = [
					{ unit: payload.unit, totalProduction: payload.totalProduction, date: Date.now() },
					...state.history.production,
				];
				if (newProductionHistory.length > historyMax) {
					newProductionHistory = newProductionHistory.slice(0, historyMax);
				}
				//Update update time
				payload.updatedAt = Date.now();

				return onSuccess({
					...state,
					production: payload,
					history: { ...state.history, production: newProductionHistory },
				});
			}
			/**
			 * Update company totals data (total costs)
			 */
			case 'UpdateCompanyTotals': {
				if (!payload || 'expenses' in payload === false) return onError('invalidData');
				//Merge and check if anything changed
				if (state?.totals && 'salariesNet' in state.totals) {
					let mergedPayload = { ...state.totals, ...payload, updatedAt: state.totals?.updatedAt };
					if (JSON.stringify(state.totals) === JSON.stringify(mergedPayload)) {
						//Both data are the same, no need to update
						//return state;
					}
				}
				//Calculate current overhead and labor
				const newOverheadHistoryItem = { currency: payload.currency, amount: 0, date: Date.now() };
				const newLaborHistoryItem = { currency: payload.currency, amount: 0, date: Date.now() };
				if (payload?.expensesWithTax > 0) newOverheadHistoryItem.amount += payload?.expensesWithTax;
				if (payload?.salariesGross > 0) newOverheadHistoryItem.amount += payload?.salariesGross;
				if (payload?.labourGross > 0) newLaborHistoryItem.amount += payload?.labourGross;

				let newOverheadHistory = [...state.history?.overhead];
				let newLaborHistory = [...state.history?.labor];
				//Compare last overhead value and add to state if eligible
				if (state.history?.overhead?.length > 0) {
					if (isNaN(parseFloat(state?.history?.overhead?.[0]?.amount)) === false) {
						const lastAmount = parseFloat(state.history.overhead[0].amount);
						const diff = Math.abs(lastAmount - newOverheadHistoryItem.amount);
						if (diff > 0.1) {
							newOverheadHistory.unshift(newOverheadHistoryItem);
						}
					}
				} else {
					//Brand new history array
					newOverheadHistory.unshift(newOverheadHistoryItem);
				}

				//Compare last labor value and add to state if eligible
				if (state.history?.labor?.length > 0) {
					if (isNaN(parseFloat(state?.history?.labor?.[0]?.amount)) === false) {
						const lastAmount = parseFloat(state.history.labor[0].amount);
						const diff = Math.abs(lastAmount - newLaborHistoryItem.amount);
						if (diff > 0.1) {
							newLaborHistory.unshift(newLaborHistoryItem);
						}
					}
				} else {
					//Brand new history array
					newLaborHistory.unshift(newLaborHistoryItem);
				}

				//Enforce Max history size
				if (newLaborHistory.length > historyMax) newLaborHistory = newLaborHistory.slice(0, historyMax);
				if (newOverheadHistory.length > historyMax) newOverheadHistory = newOverheadHistory.slice(0, historyMax);

				//Update update time and return
				payload.updatedAt = Date.now();
				return onSuccess({
					...state,
					totals: payload,
					history: { ...state.history, overhead: newOverheadHistory, labor: newLaborHistory },
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
