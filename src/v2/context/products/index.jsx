import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import useProductsReducer from './useProductsReducer';

export const ProductsContext = createContext();
export const ProductsDispatchContext = createContext();

export default function ProductsProvider({ children }) {
	//Load Reducer
	const reducer = useProductsReducer();
	//Set up repo & State
	const [productsRepo, setProductsRepo] = useStorageRepo('application', 'products', []);
	const [products, dispatch] = useReducer(reducer, productsRepo);

	//Update repo if state changes
	useEffect(() => {
		setProductsRepo(products);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products]);

	return (
		<ProductsContext.Provider value={products}>
			<ProductsDispatchContext.Provider value={dispatch}>
				{/* Wrap */}
				{children}
			</ProductsDispatchContext.Provider>
		</ProductsContext.Provider>
	);
}
