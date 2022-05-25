import React, { createContext, useReducer, useEffect } from 'react';
import useConfig from '../../hooks/app/useConfig';
import useStorageRepo from '../../hooks/common/useStorageRepo';

import companyReducer from './companyReducer';
import useCompanyDefaults from './useCompanyDefaults';
import useCompanyExpenseCalculator from './useCompanyExpenseCalculator';

export const CompanyContext = createContext();
export const CompanyDispatchContext = createContext();

export default function CompanyProvider({ children }) {
	const config = useConfig();
	const historyMax = config.get('history.company') ?? 10;

	//Dependencies
	const { defaultCompany, defaultEmployee, defaultExpense } = useCompanyDefaults();
	const { calculateCost } = useCompanyExpenseCalculator();

	//Set up repo & State
	const [companyRepo, setCompanyRepo, deleteRepo] = useStorageRepo('application', 'company', defaultCompany);
	const [company, dispatch] = useReducer(companyReducer, companyRepo);

	//Update repo if state changes
	useEffect(() => {
		if (!company || (defaultCompany && Object.keys(company).length !== Object.keys(defaultCompany).length)) {
			console.warn('Detected data corruption @company. Company data is reset back to defaults.');
			setCompanyRepo(defaultCompany);
		} else {
			setCompanyRepo(company);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company]);

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ currency');

		//Inject
		action.dependencies = {
			historyMax,
			defaultCompany,
			defaultEmployee,
			defaultExpense,
			calculateCost,
		};
		//Dispatch
		dispatch(action);
	};

	return (
		<CompanyContext.Provider value={company}>
			<CompanyDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</CompanyDispatchContext.Provider>
		</CompanyContext.Provider>
	);
}
