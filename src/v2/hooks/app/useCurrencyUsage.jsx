import useCompanyEmployees from '../../context/company/useCompanyEmployees';
import useCompanyExpenses from '../../context/company/useCompanyExpenses';
import useMaterials from '../../context/materials/useMaterials';
import usePackages from '../../context/packages/usePackages';

/**
 * Perform checks before taking actions. For example check if a currency is in use before deleting
 * @returns
 */
export default function useCurrencyUsage() {
	const { Materials } = useMaterials();
	const packages = usePackages();
	const employees = useCompanyEmployees();
	const expenses = useCompanyExpenses();

	function getCurrencyUsage(currencyCode = null) {
		const usage = { materials: [], packages: [], employees: [], expenses: [] };
		if (!currencyCode || typeof currencyCode !== 'string' || currencyCode.length < 2) return usage;

		//Materials
		if (Materials && typeof Materials?.findByCurrency === 'function') {
			usage.materials = Materials.findByCurrency(currencyCode);
		}

		//Packages
		if (packages && typeof packages?.findByCurrency === 'function') {
			usage.packages = packages.findByCurrency(currencyCode);
		}

		//Employees
		if (employees && typeof employees?.findByCurrency === 'function') {
			usage.employees = employees.findByCurrency(currencyCode);
		}

		//Expenses
		if (expenses && typeof expenses?.findByCurrency === 'function') {
			usage.expenses = expenses.findByCurrency(currencyCode);
		}

		return usage;
	}

	return { getCurrencyUsage };
}
