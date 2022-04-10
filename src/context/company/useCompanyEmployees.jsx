import { useContext } from 'react';
import { CompanyContext } from '../CompanyContext';
import useCompanyToaster from './useCompanyToaster';

export default function useCompanyEmployees() {
	const [company, dispatch] = useContext(CompanyContext);
	const { successToast, errorToast } = useCompanyToaster();

	console.log(company.employees);
	return {
		employees: company.employees,
	};
}
