import { useContext } from 'react';
import { PackagesContext } from '.';

/**
 * Use only this hook to access context: PACKAGES
 */
export default function usePackages() {
	const packages = useContext(PackagesContext);

	return { packages };
}
