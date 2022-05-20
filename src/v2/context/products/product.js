export default class Product {
	/**
	 * Static Data and Methods
	 */
	static fields = {
		productId: { type: 'numeric', default: '', formField: true },
		code: { type: 'string', default: '', formField: true },
		name: { type: 'string', default: '', formField: true },
		isLiquid: { type: 'boolean', default: true, formField: true },
		density: { type: 'numeric', default: 1, formField: true },
		production: { type: 'numeric', default: 0, formField: true },
	};

	static defaultProductData(overrideData = null, exclude = []) {
		if (exclude && Array.isArray(exclude) === false) {
			if (typeof exclude === 'string') {
				exclude = [exclude];
			} else {
				exclude = [];
			}
		}
		let result = {};
		Object.keys(Product.fields).forEach((key) => {
			//Skip excluded
			if (exclude.includes(key)) return;
			if (overrideData && key in overrideData) {
				result[key] = overrideData[key];
			} else {
				result[key] = Product.fields[key].default;
			}
		});

		return result;
	}
	static fieldType(field = null) {
		if (field && field in Product.fields) {
			return Product.fields[field].type;
		}
	}

	/**
	 * Instance Properties and Methods
	 */
	//Default product data
	product = null;

	constructor(data = null) {
		//Data Check
		if (!data || typeof data !== 'object' || data?.productId === undefined) return;
		//Put data in product if key exists in fields static prop
		Object.keys(data).forEach((key) => {
			if (key in Product.fields) {
				this[key] = data[key];
			}
		});
		//Save original data
		this.product = { ...data };
	}

    /**
     * Get annual production weight for cost calculations
     */
	get productionMass() {
		if (this.isLiquid === false) return this.production;
		if (this.density > 0) {
			return this.production * this.density;
		} else {
			return 0;
		}
	}
}
