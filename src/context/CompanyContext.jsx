import React, { createContext, useEffect, useReducer } from 'react';
import useStorageRepo from '../hooks/common/useStorageRepo';
import useCompanyDefaults from './company/useCompanyDefaults';
import useCompanyReducer from './company/useCompanyReducer';

export const CompanyContext = createContext();

export default function CompanyContextProvider({ children }) {
	//Dependencies
	const { defaultCompany } = useCompanyDefaults();
	//Repo
	const [companyRepo, setCompanyRepo] = useStorageRepo('application', 'company', defaultCompany);
	//Reducer
	const companyReducer = useCompanyReducer();
	const [company, dispatch] = useReducer(companyReducer, companyRepo);
	//Save state to repo
	useEffect(() => {
		setCompanyRepo(company);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company]);

	//Export context wrapper
	return (
		<CompanyContext.Provider value={[company, dispatch]}>
			{/* Company Data will be available for children */}
			{children}
		</CompanyContext.Provider>
	);
}
