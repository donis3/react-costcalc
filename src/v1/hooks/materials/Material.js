import { fields } from './useMaterials';
/**
 * Single Material constructor
 */
export default class Material {
	t = (text) => text; //Default translate function
	fields = Object.keys(fields);
	config = {};
	taxedPrice = 0;
	displayMoney = (amount, currency) => currency + ' ' + amount;
	displayNumber = (n) => n;
	convert = (amount, currency, target) => null;
	defaultCurrency = null;

	baseUnitPrice = 0; //Converted price from other units to L or KG
	baseUnitPriceWithTax = 0; //Converted price from other units to L or KG

	priceHistory = [];
	localPriceHistory = [];

	constructor(data = null, translate = null, config = null, displayMoney = null, displayNumber = null, convert = null) {
		if (!data || typeof data !== 'object' || Object.keys(data).length === 0) return null;
		if (translate && typeof translate === 'function') this.t = translate;
		if (config && typeof config === 'object') this.config = config;

		if (typeof displayMoney === 'function') this.displayMoney = displayMoney;
		if (typeof displayNumber === 'function') this.displayNumber = displayNumber;
		if (typeof convert === 'function') this.convert = convert;

		//Get all data
		Object.keys(data).forEach((key) => {
			if (!this.fields.includes(key)) return;
			this[key] = data[key];
		});

		//Get default currency for conversions
		this.defaultCurrency = this.config.getDefaultCurrency(true);

		this.calculatePriceWithTax();
		this.calculateBaseUnitPrice();

		
	}

	/**
	 * Get a price object
	 * options: local for converted to default currency prices
	 * base for converted to base unit prices like L or kg
	 */
	getPrice({ local = true, base = true } = {}) {
		const price = parseFloat(this.price) || 0;
		return this.createPriceObject({ amount: price, local, base });
	}

	/**
	 * Find the previous price if available and return price object
	 * returns current price if not found
	 * @param {*} param0
	 * @returns
	 */
	getPreviousPrice({ local = true, base = true } = {}) {
		//Check availability
		if (!Array.isArray(this.priceHistory) || this.priceHistory.length === 0) {
			return this.getPrice({ local, base }); //Return current if not found
		}
		//Find previous different price
		const previousPrice = this.priceHistory.find((item) => item.amount !== this.price);
		if (!previousPrice) {
			return this.getPrice({ local, base }); //Return current if not found
		}

		return this.createPriceObject({ amount: previousPrice.amount, local, base });
	}

	/**
	 * Private method for generating price object
	 * @param {*} param0
	 * @returns
	 */
	createPriceObject({ amount, local, base }) {
		const price = parseFloat(amount) || 0;
		const tax = parseFloat(this.tax) || 0;
		const currency = this.currency || this.defaultCurrency;

		const unit = this.config.getUnit(this.unit);
		const baseUnit = this.config.getBaseUnit(this.unit);

		//Default result
		const result = { price, tax, unit: this.unit, priceWithTax: price, currency };
		//Convert to local price if requested
		if (local === true && currency !== this.defaultCurrency) {
			result.price = this.convert(price, currency, this.defaultCurrency).amount;
			result.currency = this.defaultCurrency;
		}
		//Convert to base unit if requested
		if (base === true && baseUnit !== result.unit) {
			//Get conversion rate
			const unitToBaseUnitRatio = parseFloat(unit.value);
			if (isNaN(unitToBaseUnitRatio)) {
				throw new Error(`Base unit conversion failed for ${this.unit} to ${baseUnit}`);
			}
			result.price = result.price / unitToBaseUnitRatio;
			result.unit = baseUnit;
		}

		//Calculate full price
		result.priceWithTax = tax === 0 ? result.price : result.price * (1 + tax / 100);
		return result;
	}

	calculatePriceWithTax() {
		let p = parseFloat(this.price);
		let t = parseFloat(this.tax);
		if (isNaN(p) || isNaN(t)) return (this.taxedPrice = p);
		if (t === 0) return (this.taxedPrice = p);
		this.taxedPrice = p + (p / 100) * t;
	}

	get fullPrice() {
		return this.displayMoney(this.price, this.currency);
	}

	get fullUnit() {
		return ` ${this.t(`units.${this.unit}`, { ns: 'translation' })}  (${this.unit})`;
	}

	get fullDensity() {
		return `${this.t('details.densityText', { value: this.displayNumber(this.density, 2) })}`;
	}
	get fullTax() {
		return `% ${this.displayNumber(this.tax, 2)}`;
	}

	get priceWithTax() {
		return this.displayMoney(this.taxedPrice, this.currency);
	}

	get localPriceWithTax() {
		const localPriceObj = this.convert(this.taxedPrice, this.currency, this.defaultCurrency);
		return localPriceObj ? localPriceObj.amount : null;
	}

	get localPrice() {
		const localPriceObj = this.convert(this.price, this.currency, this.defaultCurrency);
		return localPriceObj ? localPriceObj.amount : null;
	}

	get localPriceString() {
		return this.displayMoney(this.localPrice, this.defaultCurrency);
	}
	get localPriceWithTaxString() {
		return this.displayMoney(this.localPriceWithTax, this.defaultCurrency);
	}

	get isForeignCurrency() {
		return this.defaultCurrency !== this.currency;
	}

	get isBaseUnit() {
		//Determine if this materials unit is already a base unit
		if (this.config.getBaseUnit(this.unit) === this.unit) {
			return true;
		}
		return false;
	}

	get baseUnit() {
		return this.config.getBaseUnit(this.unit);
	}

	get isLiquid() {
		return this.config.isLiquid(this.unit);
	}

	get localBaseUnitPrice() {
		if (!this.isForeignCurrency) return this.baseUnitPrice;
		const result = this.convert(this.baseUnitPrice, this.currency);
		return result ? result.amount : null;
	}
	get localBaseUnitPriceWithTax() {
		if (!this.isForeignCurrency) return this.baseUnitPriceWithTax;
		const result = this.convert(this.baseUnitPriceWithTax, this.currency);
		return result ? result.amount : null;
	}

	/**
	 * Should run at constructor
	 * Convert price to per base unit
	 * For example if the price is per tonne convert it to per kg
	 */
	calculateBaseUnitPrice() {
		//get unit conversion
		const unit = this.config.getUnit(this.unit);
		if (!unit || 'value' in unit === false || isNaN(parseFloat(unit.value))) return;
		//This is the ratio between unit/base unit.
		//to get the base price, we must divide normal price to this ratio
		const unitToBaseUnitRatio = parseFloat(unit.value);
		if (unitToBaseUnitRatio <= 0) return;
		//Calculate prices
		this.baseUnitPrice = this.price / unitToBaseUnitRatio;
		this.baseUnitPriceWithTax = this.taxedPrice / unitToBaseUnitRatio;
	}
}
