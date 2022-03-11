import { useTranslation } from 'react-i18next';
import useJoi from '../common/useJoi';

export default function useRecipeFormSchema() {
	//Load custom joi instance and load translation
	const { t } = useTranslation('pages/recipes');
	const Joi = useJoi();

	//Create defaults
	const defaults = {
		name: t('formDefaults.name'),
		recipeId: 0,
		productId: 0,
		yield: 0,
		materials: [], //[{materialId, amount, unit (baseUnit) }] //amount in baseUnit
	};

	// Create individual field schemas
	const partialSchemas = {};

	//Recipe Name
	partialSchemas.name = Joi.string().min(3).max(50).required().label(t('labels.name'));

	//Recipe Id
	partialSchemas.recipeId = Joi.number().integer().min(0).label(t('labels.recipeId'));

	//productId
	partialSchemas.productId = Joi.number().integer().min(0).label(t('labels.productId'));

	//Yield
	partialSchemas.yield = Joi.number().min(0).label(t('labels.yield'));

	//Materials
	partialSchemas.materials = Joi.array().label(t('labels.materialId'));

	const schema = Joi.object({
		...partialSchemas,
	}).options({ abortEarly: false });

	return { partialSchemas, schema, defaults };
}
