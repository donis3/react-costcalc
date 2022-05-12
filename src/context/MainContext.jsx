import React, { createContext, useContext, useMemo } from 'react';
import useCurrency from '../hooks/app/useCurrency';
import useEndProducts from '../hooks/endproducts/useEndProducts';
import useMaterials from '../hooks/materials/useMaterials';
import usePackages from '../hooks/packages/usePackages';
import useProducts from '../hooks/products/useProducts';
import useRecipes from '../hooks/recipes/useRecipes';

/* Create Contexts Here Separately */
export const MaterialContext = createContext();
export const MaterialDispatch = createContext();
export const ProductsContext = createContext();
export const ProductsDispatch = createContext();
export const CurrencyContext = createContext();
export const CurrencyDispatch = createContext();

export const RecipesContext = createContext();
export const RecipesDispatch = createContext();

export const PackagesContext = createContext();
export const PackagesDispatch = createContext();

export const EndProductsContext = createContext();
export const EndProductsDispatch = createContext();

/* Providers */
export default function MainContext({ children }) {
	const { Materials, dispatchMaterials } = useMaterials();
	const { products, dispatchProducts } = useProducts();
	const { currencies, dispatchCurrencies } = useCurrency();
	const { recipes, dispatchRecipes } = useRecipes();
	const [packages, dispatchPackages] = usePackages();
	const [endProducts, dispatchEndProducts] = useEndProducts(recipes, packages);

	//Memoize repos
	const materialsMemoized = useMemo(() => ({ Materials }), [Materials]);
	const productsMemoized = useMemo(() => ({ products }), [products]);
	const currenciesMemoized = useMemo(() => ({ currencies }), [currencies]);
	const recipesMemoized = useMemo(() => ({ recipes }), [recipes]);
	const packagesMemoized = useMemo(() => ({ packages }), [packages]);
	const endProductsMemoized = useMemo(() => ({ endProducts }), [endProducts]);

	//All Context Providers wrapped 
	return (
		// Currency Conversion Rates
		<CurrencyContext.Provider value={currenciesMemoized}>
			<CurrencyDispatch.Provider value={{ dispatch: dispatchCurrencies }}>
				{/* Products */}
				<ProductsContext.Provider value={productsMemoized}>
					<ProductsDispatch.Provider value={{ dispatch: dispatchProducts }}>
						{/* Materials */}
						<MaterialContext.Provider value={materialsMemoized}>
							<MaterialDispatch.Provider value={{ dispatch: dispatchMaterials }}>
								{/* Recipes */}
								<RecipesContext.Provider value={recipesMemoized}>
									<RecipesDispatch.Provider value={{ dispatch: dispatchRecipes }}>
										{/* Packages */}
										<PackagesContext.Provider value={packagesMemoized}>
											<PackagesDispatch.Provider value={{ dispatch: dispatchPackages }}>
												{/* EndProducts */}
												<EndProductsContext.Provider value={endProductsMemoized}>
													<EndProductsDispatch.Provider value={{ dispatch: dispatchEndProducts }}>
														{/* Wrap the whole app with the context */}
														{children}
													</EndProductsDispatch.Provider>
												</EndProductsContext.Provider>
											</PackagesDispatch.Provider>
										</PackagesContext.Provider>
									</RecipesDispatch.Provider>
								</RecipesContext.Provider>
							</MaterialDispatch.Provider>
						</MaterialContext.Provider>
						{/* Materials */}
					</ProductsDispatch.Provider>
				</ProductsContext.Provider>
				{/* Products */}
			</CurrencyDispatch.Provider>
		</CurrencyContext.Provider>
		// Currencies
	);
}
//=======| Hooks For Ease of use
//Currencies
export function useCurrencyContext() {
	return useContext(CurrencyContext);
}
export function useCurrencyDispatch() {
	return useContext(CurrencyDispatch);
}

//Materials
export function useMaterialContext() {
	return useContext(MaterialContext);
}
export function useMaterialDispatchContext() {
	return useContext(MaterialDispatch);
}
//Products
export function useProductsContext() {
	return useContext(ProductsContext);
}
export function useProductDispatchContext() {
	return useContext(ProductsDispatch);
}

//Recipes
export function useRecipesContext() {
	return useContext(RecipesContext);
}
export function useRecipesDispatchContext() {
	return useContext(RecipesDispatch);
}

//Packages
export function usePackagesContext() {
	return useContext(PackagesContext);
}
export function usePackagesDispatch() {
	return useContext(PackagesDispatch);
}

//End Products
export function useEndProductsContext() {
	return useContext(EndProductsContext);
}
export function useEndProductsDispatch() {
	return useContext(EndProductsDispatch);
}
