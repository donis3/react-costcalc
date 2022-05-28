import { useTranslation } from 'react-i18next';
import useJoi from '../../hooks/common/useJoi';

export default function useEndproductsDefaults() {
	const { t } = useTranslation('pages/endproducts');
	const Joi = useJoi();

	const defaultFields = {
		recipeId: '',
		packageId: '',
		name: '',
		commercialName: '',
		notes: '',
	};

	/**
	 * Bind module schema parameters to given schema
	 * @param {*} schema
	 */
	function bindSchema(schema) {
		schema.endId = Joi.string().empty('').guid({ version: 'uuidv4' }).label(t('name'));
		schema.recipeId = Joi.string().guid({ version: 'uuidv4' }).label(t('labels.recipe'));
		schema.packageId = Joi.string().guid({ version: 'uuidv4' }).label(t('labels.package'));
		schema.name = Joi.string().min(3).max(100).required().label(t('labels.name'));
		schema.commercialName = Joi.string().min(3).max(100).required().label(t('labels.commercialName'));
		schema.notes = Joi.string().min(0).max(500).label(t('labels.notes'));
	}

	return { defaultFields, bindSchema };
}
