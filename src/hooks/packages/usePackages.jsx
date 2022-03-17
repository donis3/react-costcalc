import { useReducer, useEffect } from 'react';
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

	//===================== PACKAGE API ===================//
	const clearPackages = () => {
		dispatch({ type: 'reset', payload: null });
	};

	/**
	 * Get single package by its id
	 */
	const getById = (packageId = null) => {
		packageId = parseInt(packageId);
		if (isNaN(packageId)) return null;
		const pack = packagesState.find((item) => item.packageId === packageId);
		if (!pack) return null;
		return pack;
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
		}
		return result;
	}; //End of calculate

	//===================== EXPORTS ===================//
	const payload = {
		data: packagesState,
		clearPackages,
		getAllSorted,
		getById,
	};
	return [payload, dispatch];
}
