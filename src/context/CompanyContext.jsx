import React, { createContext, useEffect, useReducer } from 'react';
import useStorageRepo from '../hooks/common/useStorageRepo';
import companyReducer from './company/companyReducer';
import defaultCompany from './company/defaultCompany';

export const CompanyContext = createContext();

export default function CompanyContextProvider({ children }) {
	const [companyRepo, setCompanyRepo] = useStorageRepo('application', 'company', defaultCompany);
	const [company, dispatch] = useReducer(companyReducer, companyRepo);

	useEffect(() => {
		setCompanyRepo(company);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company]);

	return (
		<CompanyContext.Provider value={[company, dispatch]}>
			{/* Company Data will be available for children */}
			{children}
		</CompanyContext.Provider>
	);
}
