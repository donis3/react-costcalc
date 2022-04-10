import { useContext } from 'react';
import { CompanyContext } from '../CompanyContext';

/**
 * Access company context using this hook and only this hook.
 * @returns
 */
export default function useCompany() {
	const [company, dispatch] = useContext(CompanyContext);

	//Exports
	return { company, dispatch };
} //End of hook
