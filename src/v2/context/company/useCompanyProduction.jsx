import { useContext, useEffect } from 'react';
import { CompanyContext, CompanyDispatchContext } from '.';
import useConfig from '../../hooks/app/useConfig';

import useProducts from '../products/useProducts';
import useCompanyDefaults from './useCompanyDefaults';

/**
 * Get total production from products module and save to company repo
 * @returns
 */
export default function useCompanyProduction() {
	const company = useContext(CompanyContext);
	const dispatch = useContext(CompanyDispatchContext);
	const { products } = useProducts();

	const { production: defaultProduction } = useCompanyDefaults();
	const config = useConfig();

	/**
	 * Get current company.production
	 * @returns {object}
	 */
	function getCurrentProduction() {
		if (company?.production && 'totalProduction' in company.production) {
			return { ...company.production };
		} else {
			return { ...defaultProduction };
		}
	}
	/**
	 * Generate a total production object using product data
	 * @returns {object}
	 */
	function calculateTotalProduction(products) {
		//Default result object with current production value
		const result = getCurrentProduction();
		const unit = config.getUnitType(result.unit) === 'weight' ? 'kg' : result.unit;
		const isWeight = config.getUnitType(unit) === 'weight';

		//Products array
		const { data } = products;

		//There are no products, production is 0
		if (!data || !Array.isArray(data) || data.length === 0) {
			return { ...result, totalProduction: 0 };
		}

		//Go through each product and get production
		const total = data.reduce((acc, product) => {
			const amount = parseFloat(isWeight ? product.productionMass : product.production);
			return isNaN(amount) ? acc : acc + amount;
		}, 0);

		//Generate new total production object
		return { ...result, unit: unit, totalProduction: total };
	}

	useEffect(() => {
		dispatch({
			type: 'UpdateCompanyProduction',
			payload: calculateTotalProduction(products),
			success: function () {
				if (!config.get('debug.companyProduction')) return;
				console.log(`Updated company production totals`);
			},
			error: function (code) {
				if (!config.get('debug.companyProduction')) return;
				console.log(`Company Production calculation failed due to ${code}`);
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products]);

	return {};
}
