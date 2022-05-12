import { useContext } from 'react';
import useConfig from '../../hooks/app/useConfig';
import { CompanyContext } from '../CompanyContext';

/**
 * Get current labour cost per unit of production
 * @returns {object} {net, gross, currency}
 */
export default function useCompanyLabourCost() {
	const config = useConfig();
	const defaultCurrency = config.getDefaultCurrency(true);
	const [company] = useContext(CompanyContext);

	function getLabourCost(company, defaultCurrency) {
		const result = { net: 0, gross: 0, currency: defaultCurrency, tax: 0 };
		if (!company || !company.totals || !company.production) return result;
		const production = parseFloat(company.production?.totalProduction);
		if (isNaN(production)) return result;
		result.currency = company.totals.currency;
		if (company.totals.labourGross > 0) {
			result.gross = company.totals.labourGross / production;
		}
		if (company.totals.labourNet > 0) {
			result.net = company.totals.labourNet / production;
		}
		//Calc tax percentage
		const diff = parseFloat(result.gross - result.net);
		if (isNaN(diff) === false && diff !== 0) {
			const tax = (diff / result.net) * 100;
			result.tax = Math.round(tax * 100) / 100;
		}

		return result;
	}

	return getLabourCost(company, defaultCurrency);
}
