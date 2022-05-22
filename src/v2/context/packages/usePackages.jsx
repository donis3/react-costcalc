import { useContext} from 'react';
import { useTranslation } from 'react-i18next';
import { validate as isUuid } from 'uuid';
import { PackagesContext, PackagesDispatchContext } from '.';
import useConfig from '../../hooks/app/useConfig';
import useMoney from '../../hooks/app/useMoney';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import usePackagesDefaults from './usePackagesDefaults';

/**
 * Use only this hook to access context: PACKAGES
 * packages doesn't depend on other modules
 * Only dependency is when deleting a package,
 * we must check if the package is being used by any endproduct. This is done at the edit form
 */
export default function usePackages() {
	//Load dependencies
	const config = useConfig();
	const packagesState = useContext(PackagesContext);
	const dispatch = useContext(PackagesDispatchContext);
	const { t } = useTranslation('pages/packages');
	const { defaultCurrency, convert } = useMoney();
	const historyLimit = config.get('history.packageCost') ?? 10;
	const { defaultPackage } = usePackagesDefaults();

	//==================// Continuous Cost Calculation //==================//
	

	//==================// Package Public Api //==================//

	/**
	 * Remove all packages from repo
	 */
	const clearPackages = () => {
		dispatch({ type: 'reset', payload: null });
	};

	/**
	 * Get all packages in an array and sort them by given field
	 * @param {*} param0
	 * @returns
	 */
	const getAllSorted = ({ field = null, asc = true } = {}) => {
		if (typeof asc !== 'boolean') asc = true;

		if (['name', 'productType'].includes(field)) {
			return sortArrayAlphabetic(packagesState, field, asc);
		} else if (['cost', 'packageCapacity'].includes(field)) {
			return sortArrayNumeric(packagesState, field, asc);
		} else {
			return packagesState;
		}
	};

	/**
	 * Find a package obj by its ID
	 * @param {*} packageId guid
	 * @param {*} getOnlyFormData return the data required for package form only
	 * @returns
	 */
	const findById = (packageId = null, getOnlyFormData = false) => {
		if (!isUuid(packageId)) return null;

		const pack = packagesState.find((item) => item.packageId === packageId);
		if (!pack) return null;

		//Create deep copy
		const packageData = JSON.parse(JSON.stringify(pack));

		//If data is not for form, generate cost details
		if (getOnlyFormData === false) {
			//Add additional fields
			packageData.itemsForCostTable = getItemsForCostTable(pack.items, defaultCurrency, convert, t);
			packageData.itemCostDetails = getItemsCostDetails(pack.items, defaultCurrency, convert);
			return packageData;
		}

		//Return only form fields. Make a deep copy of the object including items array
		return Object.keys(defaultPackage).reduce(
			(accumulator, key) => {
				if (key === 'items' && Array.isArray(packageData[key])) {
					return { ...accumulator, [key]: [...packageData[key]] };
				}
				return key in packageData ? { ...accumulator, [key]: packageData[key] } : accumulator;
			},
			{ packageId }
		); //Start with empty obj with only package ID prop
	};

	/**
	 *	Calculate package cost for each package and update it if needed.
	 * @returns
	 */
	const reCalculateCosts = () => {
		const newState = packagesState.map((item) =>
			getCostCalculatedPackage(item, defaultCurrency, convert, historyLimit)
		);
		if (JSON.stringify(newState) !== JSON.stringify(packagesState)) {
			//Costs have changed, update storage
			//console.log('Auto Updating packages');
			dispatch({ type: 'updateAll', payload: newState });
			return;
		}
		//console.log('No need for package update');
	};

	//==================// Hook Exports//==================//
	return {
		data: packagesState,
		clearPackages,
		getAllSorted,
		findById,
		count: () => (Array.isArray(packagesState) ? packagesState.length : 0),
		defaultPackage,
		dispatch,
		reCalculateCosts,
	};
} //End of hook

//==================// Helpers //==================//

/**
 * Convert items in package to an array of items suitable for costTable component
 * @param {*} items Array of items
 * @returns
 */
const getItemsForCostTable = (items = null, defaultCurrency, convert, t) => {
	if (!Array.isArray(items) || items.length === 0) return null;

	const result = items.map((item) => {
		const mutatedItem = {
			unit: 'pcs',
			name: item.name,
			price: item.itemPrice,
			tax: item.itemTax,
			quantity: 1,
			currency: item.itemCurrency,
			amount: item.itemPrice, //Convert to local price and add tax
		};
		//Convert to local
		if (item.itemCurrency !== defaultCurrency) {
			const { amount } = convert(mutatedItem.amount, mutatedItem.currency, defaultCurrency);
			mutatedItem.amount = amount;
		}
		//Add tax to amount
		if (isNaN(parseFloat(mutatedItem.tax)) === false && mutatedItem.tax > 0) {
			mutatedItem.amount = mutatedItem.amount * (1 + mutatedItem.tax / 100);
		}
		//Other operations
		if (item.packageType === 'box') {
			mutatedItem.name = t('labels.boxName', { name: mutatedItem.name, capacity: item.boxCapacity });
			mutatedItem.amount = mutatedItem.amount / item.boxCapacity;
			mutatedItem.quantity = mutatedItem.quantity / item.boxCapacity;
		}
		return mutatedItem;
	});

	return result;
};

/**
 * Create a cost item using currency conversion
 * @param {*} items
 * @returns
 */
const getItemsCostDetails = (items = null, defaultCurrency, convert) => {
	const defaultData = {
		total: 0,
		totalWithTax: 0,
		totalTax: 0,
		tax: [
			//{percent: 0, amount: 0}
		],
	};
	if (!Array.isArray(items) || items.length === 0) return defaultData;
	//Go through all items and add them all together. Convert foreign
	return items.reduce((accumulator, item) => {
		//Extract items
		let { itemPrice: price, itemCurrency: currency, itemTax: tax, packageType = null, boxCapacity = 1 } = item;
		let quantity = 1;
		price = parseFloat(price);
		tax = parseFloat(tax);
		if (isNaN(tax) || tax <= 0) tax = 0;

		//Convert price to local currency
		if (currency !== defaultCurrency) {
			const conversion = convert(price, currency, defaultCurrency);
			price = conversion.amount;
		}

		//Calculate amount and taxed amount
		let amount = price * quantity;
		//IF item is box, divide the amount by box capacity
		if (packageType === 'box' && isNaN(parseFloat(boxCapacity)) === false && parseFloat(boxCapacity) > 1) {
			amount = amount / parseFloat(boxCapacity);
		}
		const totalTax = tax > 0 ? amount * (tax / 100) : 0;
		const amountWithTax = tax > 0 ? amount * (1 + tax / 100) : amount;

		let allTaxes = [...accumulator.tax];
		//Find old tax data
		if (accumulator.tax.find((taxData) => taxData.percent === tax)) {
			//There already is an item with the same tax percentage. Add this tax amount to that
			allTaxes.map((taxItem) => {
				if (taxItem.percent !== tax) return taxItem; //This is other tax percentage item
				return { percent: tax, amount: taxItem.amount + totalTax };
			});
		} else {
			//This tax percentage is new to the array
			allTaxes.push({ percent: tax, amount: totalTax });
		}
		//Sort tax array
		allTaxes = sortArrayNumeric(allTaxes, 'percent', true);
		//return accumulator with new tax array AND add amounts to accumulated totals
		return {
			total: accumulator.total + amount,
			totalWithTax: accumulator.totalWithTax + amountWithTax,
			totalTax: accumulator.totalTax + totalTax,
			tax: allTaxes,
		};
	}, defaultData); //Start with default data
};

//Calculate current cost of a package bundle using Convert
//Add to costHistory array if price changes

/**
 * Calculate current cost of a package bundle with currency conversion
 * If price changes, add the cost item to cost history in the package obj
 * @param {*} pack
 * @returns
 */
const getCostCalculatedPackage = (pack = null, defaultCurrency, convert, historyLimit = 10) => {
	//Default result object
	const result = { ...pack, currency: defaultCurrency, tax: 0, cost: 0, costWithTax: 0 };
	//Extract items
	const { items } = pack;
	//If there aren't any items, return cost as 0
	if (!items || Array.isArray(items) === false || items.length === 0) return result;
	//Iterate through items and add their costs to totals
	items.forEach((item) => {
		const { itemPrice, itemTax, itemCurrency, packageType, boxCapacity } = item;
		//Calculate cost in default currency
		let convertedCost = convert(itemPrice, itemCurrency, defaultCurrency);
		if (!convertedCost || convertedCost.currency !== defaultCurrency) return;
		let cost = convertedCost.amount;

		cost = parseFloat(cost);
		if (isNaN(cost)) return;
		//Calculate cost per item if this is a box (multi item capacity)
		if (packageType === 'box' && parseFloat(boxCapacity) > 0 && cost > 0) {
			//This is a container box. Cost per item is divided by box capacity
			cost = cost / boxCapacity;
		}
		//Calculate amount of tax using itemTax which is percentage tax.
		let tax = parseFloat(itemTax) > 0 ? cost * parseFloat(itemTax / 100) : 0;
		if (isNaN(tax)) tax = 0;
		//calc cost with tax
		let costWithTax = cost + tax;

		//Add calculations to totals
		result.cost = result.cost + cost;
		result.tax = result.tax + tax;
		result.costWithTax = result.costWithTax + costWithTax;
	});

	const addCostHistory = (previousCost, currentCost, currency) => {
		const historicalCost = { cost: currentCost, currency, date: Date.now(), change: 0 };
		if (parseFloat(previousCost)) {
			const diff = parseFloat(currentCost - previousCost);
			if (Math.abs(diff) > 0) {
				const percentage = (diff / previousCost) * 100;
				historicalCost.change = Math.round(percentage * 100) / 100;
			}
		}
		//Add data to result
		result.costHistory.unshift(historicalCost);
	};

	//Check cost history
	if (!result.costHistory || !Array.isArray(result.costHistory)) {
		result.costHistory = [];
	}
	if (result.costHistory.length === 0) {
		//This is the first historical data
		addCostHistory(null, result.cost, result.currency);
	} else {
		const previousCost = parseFloat(result.costHistory[0]?.cost);
		if (isNaN(previousCost) || Math.round(previousCost * 100) / 100 !== Math.round(result.cost * 100) / 100) {
			//New cost is different. Add new cost to history
			addCostHistory(previousCost, result.cost, result.currency);
		}
		//Historical Data Limit
		if (result.costHistory.length > historyLimit) {
			result.costHistory.splice(historyLimit);
		}
	}

	//result.unit = result?.productType === 'liquid' ? 'L' : 'kg'; //Determine unit
	return result;
}; //End of calculate
