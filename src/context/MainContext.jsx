import React, { createContext, useContext, useMemo } from 'react';
import useCurrency from '../hooks/app/useCurrency';
import useMaterials from '../hooks/materials/useMaterials';
import useProducts from '../hooks/products/useProducts';
import useRecipes from '../hooks/recipes/useRecipes';

/* Create Contexts Here Separately */
const MaterialContext = createContext();
const MaterialDispatch = createContext();
const ProductsContext = createContext();
const ProductsDispatch = createContext();
const CurrencyContext = createContext();
const CurrencyDispatch = createContext();

const RecipesContext = createContext();
const RecipesDispatch = createContext();

/* Providers */
export default function MainContext({ children }) {
	const { Materials, dispatchMaterials } = useMaterials();
	const { products, dispatchProducts } = useProducts();
	const { currencies, dispatchCurrencies } = useCurrency();
	const { recipes, dispatchRecipes } = useRecipes();
	
	//Memoize repos
	const materialsMemoized = useMemo(() => ({ Materials }), [Materials]);
	const productsMemoized = useMemo(() => ({ products }), [products]);
	const currenciesMemoized = useMemo(() => ({ currencies }), [currencies]);
	const recipesMemoized = useMemo(() => ({ recipes }), [recipes]);

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
										{/* Wrap the whole app with the context */}
										{children}
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
