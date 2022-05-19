import { useContext } from 'react';
import { ProductsContext } from '.';

/**
 * Use only this hook to access products context
 */
export default function useProducts() {
	const products = useContext(ProductsContext);

	return { products };
}
