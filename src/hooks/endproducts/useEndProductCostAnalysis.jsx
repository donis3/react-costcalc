import { useTranslation } from 'react-i18next';
import useCurrencyConversion from '../app/useCurrencyConversion';
import useIntl from '../common/useIntl';

export default function useEndProductCostAnalysis({ recipeItems = [], packageItems = [], showTax = false } = {}) {
	const { t } = useTranslation('translation');
	const { displayNumber } = useIntl();
	const { convert, defaultCurrency } = useCurrencyConversion();
	if (!Array.isArray(recipeItems)) recipeItems = [];
	if (!Array.isArray(packageItems)) packageItems = [];

	//Default Payload
	const chartData = {
		labels: [],
		data: [],
	};

	// { name , price, tax, quantity, unit = 'kg', amount, currency }
	const costItems = [];

	//Load materials
	recipeItems.forEach((material) => {
		const labelText = `${material.name} - ${displayNumber(material.amount, 2)} ${material.unit}`;
		chartData.labels.push(labelText);
		let cost = material.amount * material.localPrice;
		//Add tax if requested
		if (showTax && material.tax > 0) {
			cost = cost * (1 + material.tax / 100);
		}
		chartData.data.push(cost);

		//Add it as a cost item as well
		let costItem = {
			name: material.name,
			price: material.price,
			tax: material.tax,
			quantity: material.amount,
			unit: material.unit,
			amount: cost,
			currency: material.currency,
		};
		costItems.push(costItem);
	});

	//Load packaging items
	packageItems.forEach((item) => {
		//Generate label text and save at chart data
		let labelText = item.name;
		if (item.packageType === 'box') {
			labelText += ` - ${t('packageTypes.boxWithCapacity', { ns: 'translation', capacity: item.boxCapacity })}`;
		} else {
			labelText += ` - ${t('packageTypes.' + item.packageType, { ns: 'translation' })}`;
		}
		chartData.labels.push(labelText);

		//Calculate item cost
		let cost = convert(item.itemPrice, item.itemCurrency, defaultCurrency).amount;
		//Add tax if requested
		if (showTax && item.itemTax > 0) {
			cost = cost * (1 + item.itemTax / 100);
		}
		//If box, divide by box capacity to calculate cost per item
		if (item.packageType === 'box' && item.boxCapacity > 0) {
			cost = cost / item.boxCapacity;
		}

		if (isNaN(parseFloat(cost)) === false) {
			chartData.data.push(cost);
		}

		//Add it as a cost item as well
		let quantity = 1;
		if (item.packageType === 'box' && item.boxCapacity > 0) quantity = 1 / item.boxCapacity;

		let costItem = {
			name: item.name,
			price: item.itemPrice,
			tax: item.itemTax,
			quantity: quantity,
			unit: 'pcs',
			amount: cost,
			currency: item.itemCurrency,
		};
		costItems.push(costItem);
	});

	return { chartData, costItems, costTotals: generateCostTotals(costItems) };
}

/*
{
  "total": 71.32,
  "totalWithTax": 83.15759999999999,
  "totalTax": 11.8376,
  "tax": [
    {
      "percent": 8,
      "amount": 0.8
    },
    {
      "percent": 18,
      "amount": 11.0376
    }
  ]
}
*/
/**
 * Generate an object for costTable footer with totals
 * @param {*} costItems Array of cost items
 */
function generateCostTotals(costItems = []) {
	const result = {
		total: 0,
		totalWithTax: 0,
		totalTax: 0,
		tax: [], // {percent, amount}
	};
	if (!Array.isArray(costItems)) return result;
	const taxes = costItems.reduce((accumulator, current) => {
		//Extract tax percent and money amount for this item
		let { tax, amount } = current;
		tax = parseFloat(tax);
		amount = parseFloat(amount);
		if (isNaN(tax) || isNaN(amount) || tax <= 0) return accumulator;

		//calculate tax cost
		const taxAmount = amount * (tax / 100);

		//Check if this tax percentage already exists
		let newTaxItem = accumulator.find((taxItem) => taxItem.percent === tax);
		if (newTaxItem) {
			//There already is a tax item for this percentage
			newTaxItem.amount += taxAmount;
			return accumulator.map((taxItem) => {
				if (taxItem.percent === tax) return newTaxItem;
				return taxItem;
			});
		}
		newTaxItem = { percent: tax, amount: taxAmount };
		return [...accumulator, newTaxItem];
	}, []);

	//Calculate totals
	const totals = costItems.reduce((accumulator, current) => {
		let { tax, amount } = current;
		tax = parseFloat(tax);
		amount = parseFloat(amount);
		if (isNaN(amount)) return accumulator;

		let amountWithTax = amount;
		let taxAmount = 0;
		if (isNaN(tax) === false && tax > 0) {
			taxAmount = amount * (tax / 100);
			amountWithTax += taxAmount;
		}
		accumulator.total += amount;
		accumulator.totalWithTax += amountWithTax;
		accumulator.totalTax += taxAmount;

		return accumulator;
	}, result);

	totals.tax = taxes;

	return totals;
}
