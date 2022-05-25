import React from 'react';
import { AppContextProvider } from './app';
import CompanyProvider from './company';
import CurrencyProvider from './currency';
import EndproductsProvider from './endproducts';
import MaterialsProvider from './materials';
import PackagesProvider from './packages';
import ProductsProvider from './products';
import RecipesProvider from './recipes';
import SettingsProvider from './settings';
import WidgetsProvider from './widgets';

export default function ContextWrapper({ children }) {
	return (
		<AppContextProvider>
			<SettingsProvider>
				<CurrencyProvider>
					<CompanyProvider>
						<ProductsProvider>
							<MaterialsProvider>
								<RecipesProvider>
									<PackagesProvider>
										<EndproductsProvider>
											<WidgetsProvider>
												{/* Wrap */}
												{children}
											</WidgetsProvider>
										</EndproductsProvider>
									</PackagesProvider>
								</RecipesProvider>
							</MaterialsProvider>
						</ProductsProvider>
					</CompanyProvider>
				</CurrencyProvider>
			</SettingsProvider>
		</AppContextProvider>
	);
}
