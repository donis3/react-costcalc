import { useTranslation } from 'react-i18next';
import useJoi from '../../hooks/common/useJoi';

export default function useEndproductsDefaults() {
	const { t } = useTranslation('pages/endproducts');
	const Joi = useJoi();

	const schema = Joi.object({
		endId: Joi.string().empty('').guid({ version: 'uuidv4' }).label(t('name')),
		recipeId: Joi.string().guid({ version: 'uuidv4' }).label(t('labels.recipe')),
		packageId: Joi.string().guid({ version: 'uuidv4' }).label(t('labels.package')),

		name: Joi.string().min(3).max(100).required().label(t('labels.name')),
		commercialName: Joi.string().min(3).max(100).required().label(t('labels.commercialName')),
		notes: Joi.string().min(0).max(500).label(t('labels.notes')),
	});

	const defaultFields = {
		recipeId: '',
		packageId: '',
		name: '',
		commercialName: '',
		notes: '',
	};

	return { schema, defaultFields };
}
