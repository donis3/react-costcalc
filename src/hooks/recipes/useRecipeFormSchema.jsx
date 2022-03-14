import { useTranslation } from 'react-i18next';
import useJoi from '../common/useJoi';

export const defaultRecipeSchema = {
	name: '',
	recipeId: 0,
	productId: 0,
	yield: 0,
	notes: '',
	materials: [],
	createdAt: Date.now(),
	updatedAt: Date.now(),
};

export default function useRecipeFormSchema() {
	//Load custom joi instance and load translation
	const { t } = useTranslation('pages/recipes');
	const Joi = useJoi();

	// Create individual field schemas
	const partialSchemas = {};

	//Recipe Name
	partialSchemas.name = Joi.string().min(3).max(50).required().label(t('labels.name'));

	//Recipe Notes
	partialSchemas.notes = Joi.string().min(0).max(500).label(t('labels.notes'));

	//Recipe Id
	partialSchemas.recipeId = Joi.number().integer().min(0).label(t('labels.recipeId'));

	//productId
	partialSchemas.productId = Joi.number().integer().min(0).label(t('labels.productId'));

	//Yield
	partialSchemas.yield = Joi.number().min(0.01).label(t('labels.yield'));

	//Materials
	partialSchemas.materials = Joi.array().label(t('labels.materialId'));

	//Updated At
	partialSchemas.updatedAt = Joi.any();
	//Created At
	partialSchemas.createdAt = Joi.any();

	const schema = Joi.object({
		...partialSchemas,
	}).options({ abortEarly: false });

	return { partialSchemas, schema, defaults: defaultRecipeSchema };
}
