import { useContext, useMemo } from 'react';
import { CompanyContext } from '.';
import useMoney from '../../hooks/app/useMoney';

export default function useCompanyCosts() {
	const company = useContext(CompanyContext);
	const { defaultCurrency, currencies, convert } = useMoney();

	/**
	 * Overhead cost per produced unit
	 * @param {Object} company company class
	 * @param {string} defaultCurrency default currency code
	 * @param {Array} allowedCurrencies array of allowed currencies
	 * @param {Function} convert convert currency function
	 * @returns
	 */
	function getOverheadCost(company, defaultCurrency, allowedCurrencies = [], convert) {
		const overhead = { net: 0, gross: 0, currency: defaultCurrency, tax: 0 };
		const production = parseFloat(company.production?.totalProduction);
		if (isNaN(production)) return overhead;

		if (company && company?.totals && 'salariesNet' in company.totals) {
			if (allowedCurrencies.includes(company.totals?.currency)) {
				overhead.currency = company.totals.currency;
			} else {
				return overhead;
			}
			const net = parseFloat(company.totals.salariesNet + company.totals.expenses);
			const gross = parseFloat(company.totals.salariesGross + company.totals.expensesWithTax);

			if (!isNaN(net) && !isNaN(gross)) {
				overhead.net = net / production;
				overhead.gross = gross / production;
				//Calc tax percentage
				const diff = parseFloat(overhead.gross - overhead.net);
				if (isNaN(diff) === false && diff !== 0) {
					const tax = (diff / overhead.net) * 100;
					overhead.tax = Math.round(tax * 100) / 100;
				}
			}
		}
		if (overhead.currency !== defaultCurrency) {
			const net = convert(overhead.net, overhead.currency, defaultCurrency, false).amount;
			const gross = convert(overhead.gross, overhead.currency, defaultCurrency, false).amount;
			if (!isNaN(parseFloat(net))) overhead.net = parseFloat(net);
			if (!isNaN(parseFloat(gross))) overhead.gross = parseFloat(gross);
		}
		return overhead;
	}

	/**
	 * Labour cost per produced unit
	 * @param {Object} company company class
	 * @param {string} defaultCurrency default currency code
	 * @returns
	 */
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

	const labourCost = useMemo(() => getLabourCost(company, defaultCurrency), [company, defaultCurrency]);

	const overheadCost = useMemo(
		() => getOverheadCost(company, defaultCurrency, currencies.allowed, convert),
		[company, defaultCurrency, currencies.allowed, convert]
	);

	return { labourCost, overheadCost };
}
