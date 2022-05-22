import { useContext } from 'react';
import { EndproductsContext, EndproductsDispatchContext } from '.';
import { validate as isUuid } from 'uuid';
import EndProduct from './Endproduct';
import { sortArrayAlphabetic, sortArrayNumeric } from '../../lib/common';
import useRecipes from '../recipes/useRecipes';
import usePackages from '../packages/usePackages';

/**
 * Use only this hook to access context: EndProducts
 */
export default function useEndproducts() {
	const endProductsState = useContext(EndproductsContext);
	const dispatch = useContext(EndproductsDispatchContext);
	const { recipes } = useRecipes();
	const packages = usePackages();
	const labourCost = null;

	EndProduct.loadDependencies({
		recipes: recipes?.getAllSorted() || [],
		packages: packages?.getAllSorted() || [],
		endProducts: endProductsState,
	});

	//=======================// EndProducts Api //=======================//

	/**
	 * Go through each endproduct, calculate current cost data and dispatch all for update
	 * @param {Product[]} products Array of products
	 * @param {Object} labourCost current company labor cost object
	 * @returns
	 */
	function calculateProductCosts() {
		if (!Array.isArray(endProductsState) || endProductsState.length === 0) return;
		if (!dispatch || typeof dispatch !== 'function') return;

		//Reduce products array and create an array with endId and costs
		const productCostsArray = endProductsState.reduce((accumulator, current) => {
			const endProduct = new EndProduct(current.endId);
			const costOfProduct = calculateCost(endProduct, labourCost);
			// console.log(current.name, costOfProduct);
			const productData = { endId: current.endId, ...costOfProduct };
			//Return product id and cost information for dispatch
			return [...accumulator, productData];
		}, []);
		//Dispatch costs for batch update
		dispatch({ type: 'productCosts', payload: productCostsArray });
	}

	/**
	 * Sort all endproducts with given options and return an array of endproducts
	 * @param {*} param0
	 * @returns {EndProduct[]}
	 */
	function getAllSorted({ field = 'name', asc = true } = {}) {
		if (typeof asc !== 'boolean') asc = true;
		//Convert data to EndProduct instances
		const endProductsArray = endProductsState.map((item) => new EndProduct(item.endId));

		//Sort and return
		if (['name', 'notes', 'commercialName', 'recipeName', 'packageName'].includes(field)) {
			return sortArrayAlphabetic(endProductsArray, field, asc);
		} else if (['totalCostWithTax', 'totalCost'].includes(field)) {
			return sortArrayNumeric(endProductsArray, field, asc);
		} else {
			return endProductsArray;
		}
	}

	/**
	 * Find a single endproduct and return it as an Endproduct object or raw data object
	 * @param {string} endId Guid
	 * @param {boolean} returnClass class or data obj
	 * @returns {object | null}
	 */
	function findById(endId = null, returnClass = false) {
		if (!isUuid(endId)) return null;

		const result = endProductsState.find((item) => item.endId === endId);
		if (!result) return null;

		return returnClass ? new EndProduct(endId) : result;
	}

	//=======================// Hook Exports //=======================//
	return { data: endProductsState, findById, getAllSorted, calculateProductCosts, dispatch };
}

//=======================// HELPERS //=======================//

/**
 * Calculate cost data for a single product instance
 * @param {Product} product
 * @param {Object} labourCost current labor cost data of the company.Ex: {net: 0, gross :0}
 * @returns {Object} cost data for the product
 */
function calculateCost(product = null, labourCost = null) {
	if (!isUuid(product?.endId)) return null;
	let quantity = 1;

	if (!product?.package || !product?.recipe) {
		console.info(`Missing package / recipe data for End-Product: ${product.name}`);
	}

	//This is default return object
	const costData = {
		labourCost: 0,
		labourCostTax: 0,
		recipeCost: 0,
		recipeTax: 0,
		packageCost: 0,
		packageTax: 0,
		total: 0,
		totalWithTax: 0,
	};
	//Find package data
	if (product.package && 'cost' in product.package) {
		let { packageCapacity, cost, tax } = product.package;
		packageCapacity = parseFloat(packageCapacity);
		cost = parseFloat(cost);
		tax = parseFloat(tax);

		if (isNaN(packageCapacity) === false) quantity = packageCapacity;
		if (isNaN(cost) === false) costData.packageCost = cost;
		if (isNaN(tax) === false) costData.packageTax = tax;
	}

	//Find unit cost for this recipe
	if (product.recipe && Array.isArray(product.recipe.unitCosts) && product.recipe.unitCosts.length > 0) {
		let recipeUnitCost = { ...product.recipe.unitCosts[0] };
		let { cost, costWithTax } = recipeUnitCost;

		cost = parseFloat(cost);
		costWithTax = parseFloat(costWithTax);
		if (isNaN(cost) === false) costData.recipeCost = quantity * cost;
		if (isNaN(costWithTax) === false) costData.recipeTax = quantity * (costWithTax - cost);
	}

	//Find labour cost for this recipe
	if (labourCost && 'gross' in labourCost) {
		const weight = parseFloat(product.getWeight());
		if (isNaN(weight) === false) {
			const labourNet = labourCost.net * weight;
			const labourGross = labourCost.gross * weight;
			costData.labourCost = labourNet;
			costData.labourCostTax = labourGross - labourNet;
		}
	}

	costData.total = costData.recipeCost + costData.packageCost + costData.labourCost;
	costData.totalWithTax = costData.total + costData.recipeTax + costData.packageTax + costData.labourCostTax;
	return costData;
}
