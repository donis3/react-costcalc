import React, { createContext, useReducer, useEffect } from 'react';
import useStorageRepo from '../../hooks/common/useStorageRepo';
import productsReducer from './productsReducer';

export const ProductsContext = createContext();
export const ProductsDispatchContext = createContext();

export default function ProductsProvider({ children }) {
	//Set up repo & State
	const [productsRepo, setProductsRepo] = useStorageRepo('application', 'products', []);
	const [products, dispatch] = useReducer(productsReducer, productsRepo);

	//Update repo if state changes
	useEffect(() => {
		setProductsRepo(products);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products]);

	//Dispatch dependency injection
	const dispatchWrapper = (action) => {
		if (!action) throw new Error('Invalid dispatch request @ Products');
		//Inject
		action.dependencies = {};
		//Dispatch
		dispatch(action);
	};

	return (
		<ProductsContext.Provider value={products}>
			<ProductsDispatchContext.Provider value={dispatchWrapper}>
				{/* Wrap */}
				{children}
			</ProductsDispatchContext.Provider>
		</ProductsContext.Provider>
	);
}
