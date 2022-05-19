import { useContext } from 'react';
import { MaterialsContext } from '.';

/**
 * Use only this hook to access products context
 */
export default function useMaterials() {
	const materials = useContext(MaterialsContext);

	return { materials };
}
