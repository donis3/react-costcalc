import { useTranslation } from 'react-i18next';
import useConfig from '../../hooks/app/useConfig';
import useJoi from '../../hooks/common/useJoi';
import useSettings from '../settings/useSettings';

export default function useMaterialsDefaults({ schema = {}, isEdit = false } = {}) {
	const { t } = useTranslation('pages/materials');
	const Joi = useJoi();
	const config = useConfig();
	const { currencies } = useSettings();

	if (isEdit) schema.materialId = Joi.string().guid({ version: 'uuidv4' }).label(t('form.materialId'));
	schema.name = Joi.string().min(3).max(100).required().label(t('form.name'));
	schema.provider = Joi.string().min(3).max(100).required().label(t('form.provider'));
	schema.density = Joi.number().positive().precision(2).required().label(t('form.density'));
	schema.tax = Joi.number().min(0).precision(2).required().label(t('form.tax'));
	schema.price = Joi.number().min(0).precision(2).required().label(t('form.price'));
	//Selects
	schema.unit = Joi.string()
		.min(1)
		.required()
		.valid(...config.getUnitsArray())
		.label(t('form.unit'));
	schema.currency = Joi.string()
		.uppercase()
		.min(1)
		.valid(...currencies.allowed)
		.required()
		.label(t('form.currency'));

	//Exports
	return { schema };
}
