import React, { createContext, useContext, useMemo } from 'react';
import useMaterials from '../hooks/materials/useMaterials';
import useProducts from '../hooks/products/useProducts';

/* Create Contexts Here Separately */
const MaterialContext = createContext();
const MaterialDispatch = createContext();
const ProductsContext = createContext();
const ProductsDispatch = createContext();

/* Providers */
export default function MainContext({ children }) {
	const { Materials, dispatchMaterials } = useMaterials();
	const { products, dispatchProducts } = useProducts();

	//Memoize repos
	const materialsMemoized = useMemo(() => ({ Materials }), [Materials]);
	const productsMemoized = useMemo(() => ({ products }), [products]);

	//All Context Providers wrapped
	return (
		/* Products */
		<ProductsContext.Provider value={productsMemoized}>
			<ProductsDispatch.Provider value={{ dispatch: dispatchProducts }}>
				{/* Materials */}
				<MaterialContext.Provider value={materialsMemoized}>
					<MaterialDispatch.Provider value={{ dispatch: dispatchMaterials }}>
						{/* Wrap the whole app with the context */}
						{children}
					</MaterialDispatch.Provider>
				</MaterialContext.Provider>
			</ProductsDispatch.Provider>
		</ProductsContext.Provider>
	);
}

/* Easy Access Hooks */
export function useMaterialContext() {
	return useContext(MaterialContext);
}
export function useMaterialDispatchContext() {
	return useContext(MaterialDispatch);
}
export function useProductsContext() {
	return useContext(ProductsContext);
}
export function useProductDispatchContext() {
	return useContext(ProductsDispatch);
}
