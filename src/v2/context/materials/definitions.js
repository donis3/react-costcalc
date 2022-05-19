/**
 * Define fields and defaults for a material
 */
export const fields = {
	materialId: { type: 'string', default: '' },
	tax: { type: 'numeric', default: 0 },
	price: { type: 'numeric', default: 0 },
	density: { type: 'numeric', default: 1 },
	name: { type: 'string', default: '' },
	provider: { type: 'string', default: '' },
	currency: { type: 'string', default: 'TRY' },
	unit: { type: 'string', default: 'kg' },
	priceHistory: { type: 'array', default: [] },
	localPriceHistory: { type: 'array', default: [] },
	createdAt: { type: 'numeric', default: Date.now() },
	updatedAt: { type: 'numeric', default: Date.now() },
};
