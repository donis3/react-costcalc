import { useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import useCurrency from '../app/useCurrency';

import useCurrencyConversion from '../app/useCurrencyConversion';

import useStorageRepo from '../common/useStorageRepo';
import packagesReducer from './packagesReducer';

export const defaultPackage = {
	//Form fields
	name: '',
	productType: 'liquid',
	packageCapacity: 0,
	notes: '',
	items: [],

	/*
    Generated fields
    packageId: null,
    
    createdAt: Date.now(),
    updatedAt: Date.now(),
    cost: 0,
    currency: 0,
    tax: 0,
    costWithTax: 0,
    costHistory: [],
	unit: 'kg',
    */
};

export default function usePackages() {
	//Load local storage for this repo
	const [packagesRepo, setPackagesRepo] = useStorageRepo('application', 'packages', []);
	//Initialize state using local storage data
	const [packagesState, dispatch] = useReducer(packagesReducer, packagesRepo);
	//Whenever state changes, save it to local storage repo
	useEffect(() => {
		reCalculateCosts();
		setPackagesRepo(packagesState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packagesState]);

	//===================== Dependencies  ===================//
	const { convert } = useCurrencyConversion();
	const {
		currencies: { defaultCurrency },
	} = useCurrency();

	const { t } = useTranslation('pages/packages');

	//===================== PACKAGE API ===================//
	const clearPackages = () => {
		dispatch({ type: 'reset', payload: null });
	};

	/**
	 * Get single package by its id
	 */
	const findById = (packageId = null, getOnlyFormData = false) => {
		packageId = parseInt(packageId);
		if (isNaN(packageId)) return null;
		const pack = packagesState.find((item) => item.packageId === packageId);
		if (!pack) return null;
		//Create deep copy
		const packageData = JSON.parse(JSON.stringify(pack));

		if (getOnlyFormData === false) {
			//Add additional fields
			packageData.itemsForCostTable = getItemsForCostTable(pack.items);
			packageData.itemCostDetails = getItemsCostDetails(pack.items);
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

	//===================== PACKAGE INTERNAL OPERATIONS ===================//

	const reCalculateCosts = () => {
		const newState = packagesState.map((item) => getCostCalculatedPackage(item));
		if (JSON.stringify(newState) !== JSON.stringify(packagesState)) {
			//Costs have changed, update storage
			//console.log('Auto Updating packages');
			dispatch({ type: 'updateAll', payload: newState });
			return;
		}
		//console.log('No need for package update');
	};

	//Convert items array suitable for costs table
	const getItemsForCostTable = (items = null) => {
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
				mutatedItem.amount = mutatedItem.amount / item.boxCapacity
				mutatedItem.quantity = mutatedItem.quantity / item.boxCapacity
			}
			return mutatedItem;
		});

		return result;
	};

	//Prepare an object with local currency cost details reduced from all items in the package
	const getItemsCostDetails = (items = null) => {
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
	const getCostCalculatedPackage = (pack = null) => {
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
			if (result.costHistory.length > 10) {
				result.costHistory.splice(10);
			}
		}

		//result.unit = result?.productType === 'liquid' ? 'L' : 'kg'; //Determine unit
		return result;
	}; //End of calculate

	//===================== EXPORTS ===================//
	const payload = {
		data: packagesState,
		clearPackages,
		getAllSorted,
		findById,
		count: () => (Array.isArray(packagesState) ? packagesState.length : 0),
	};
	return [payload, dispatch];
}
