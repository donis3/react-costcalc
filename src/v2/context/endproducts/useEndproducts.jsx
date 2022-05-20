import { useContext } from 'react';
import { EndproductsContext } from '.';

/**
 * Use only this hook to access context: EndProducts
 */
export default function useEndproducts() {
	const endProducts = useContext(EndproductsContext);

	return { endProducts };
}
