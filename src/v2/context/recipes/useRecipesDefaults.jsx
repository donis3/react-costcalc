import { useTranslation } from 'react-i18next';

export default function useRecipesDefaults() {
	const { t } = useTranslation('pages/recipes');

	const defaultRecipe = {
		name: '',
		recipeId: '',
		productId: '',
		yield: 0,
		notes: '',
		materials: [],
		createdAt: null,
		updatedAt: null,
		unitCosts: [], //{ date: Date.now(), cost: 0, costWithTax: 0 }
	};

	function generateSchema(schema, joi, isEdit = false) {
		if (isEdit === true) {
			schema.recipeId = joi.string().empty('').guid({ version: 'uuidv4' }).label(t('labels.recipeId'));
		}
		schema.productId = joi.string().guid({ version: 'uuidv4' }).label(t('labels.productId'));
		schema.name = joi.string().min(3).max(50).required().label(t('labels.name'));
		schema.notes = joi.string().min(0).max(500).label(t('labels.notes'));
		schema.yield = joi.number().min(0.01).label(t('labels.yield'));
		schema.materials = joi.array().label(t('labels.materialId'));
		return schema;
	}

	return { generateSchema, defaultRecipe };
}
