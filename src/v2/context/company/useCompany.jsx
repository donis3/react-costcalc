import { useContext } from 'react';
import { CompanyContext } from '.';


/**
 * Access company context using this hook and only this hook.
 * @returns
 */
export default function useCompany() {
	const company = useContext(CompanyContext);

	//Exports
	return { company };
} //End of hook
