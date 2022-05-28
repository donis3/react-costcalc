import useCompany from '../../../context/company/useCompany';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';

import useMoney from '../../../hooks/app/useMoney';

export default function useTotalCost({ period = 'y' } = {}) {
	const { defaultCurrency } = useMoney();
	const { periods, periodCoefficients } = useCompanyDefaults();
	if (!periods.includes(period)) period = 'y';
	const { company } = useCompany();
	const coefficient = periodCoefficients[period] ? periodCoefficients[period] : 1;

	const updatedAt = company?.totals?.updatedAt;
	const overhead = calculateOverhead(period, coefficient, company, defaultCurrency);
	const labour = calculateLabour(period, coefficient, company, defaultCurrency);

	const { production } = company;
	const productionCost = calculateProduction(
		production?.totalProduction,
		production?.unit,
		company?.totals?.labourGross,
		company?.totals?.expensesWithTax + company?.totals?.salariesGross,
		period,
		coefficient
	);
	

	const combined = {
		total: labour.total + overhead.total,
		totalWithTax: labour.totalWithTax + overhead.totalWithTax,
		currency: defaultCurrency,
		period,
	};

	return { overhead, labour, combined, updatedAt, production: productionCost };
}

function calculateOverhead(period, coefficient, company, defaultCurrency) {
	//Default result
	const result = { total: 0, totalWithTax: 0, currency: defaultCurrency, period: period };
	//Verify
	if (!period || !coefficient || !company || !company.totals) return result;
	//Gather data
	result.currency = company.totals.currency;
	let total = company.totals.expenses + company.totals.salariesNet;
	let totalWithTax = company.totals.expensesWithTax + company.totals.salariesGross;
	if (isNaN(total)) total = 0;
	if (isNaN(totalWithTax)) totalWithTax = 0;
	//calculate for period
	if (coefficient !== 0 && coefficient !== 1) {
		total = total / coefficient;
		totalWithTax = totalWithTax / coefficient;
	}
	//update result
	result.total = total;
	result.totalWithTax = totalWithTax;
	return result;
}

function calculateLabour(period, coefficient, company, defaultCurrency) {
	//Default result
	const result = { total: 0, totalWithTax: 0, currency: defaultCurrency, period: period };
	//Verify
	if (!period || !coefficient || !company || !company.totals) return result;
	//Gather data
	result.currency = company.totals.currency;
	let total = company.totals.labourNet;
	let totalWithTax = company.totals.labourGross;
	if (isNaN(total)) total = 0;
	if (isNaN(totalWithTax)) totalWithTax = 0;
	//calculate for period
	if (coefficient !== 0 && coefficient !== 1) {
		total = total / coefficient;
		totalWithTax = totalWithTax / coefficient;
	}
	//update result
	result.total = total;
	result.totalWithTax = totalWithTax;
	return result;
}

/**
 * Calculate labour cost per unit of production & total production for given period
 * @param {*} production
 * @param {*} unit
 * @param {*} labourCost
 * @param {*} overheadCost
 * @param {*} period
 * @param {*} coefficient
 * @returns
 */
function calculateProduction(
	production = 0,
	unit = 'kg',
	labourCost = 0,
	overheadCost = 0,
	period = 'y',
	coefficient = 1
) {
	labourCost = parseFloat(labourCost) ?? 0;
	overheadCost = parseFloat(overheadCost) ?? 0;
	const result = { production: 0, period, cost: 0, labour: 0, overhead: 0, unit };
	if (!production || !coefficient || isNaN(coefficient)) return result;

	result.production = production / coefficient;
	result.labour = labourCost ? labourCost / production : 0;
	result.overhead = overheadCost ? overheadCost / production : 0;
	result.cost = result.labour + result.overhead;
	return result;
}
