import useJoi from '../common/useJoi';
import { useTranslation } from 'react-i18next';
import useConfig from '../app/useConfig';

export default function useSchemaMaterials() {
	const config = useConfig();
	//Get custom joi instance
	const Joi = useJoi({ abortEarly: false, convert: true });
	//Load materials translations
	const { t } = useTranslation('pages/materials');
	//Load validation schema
	const schema = getMaterialFormSchema(Joi, t, config.getUnitsArray(), config.getCurrenciesArray());

	//Define validation function
	const validate = (data) => {
		return schema.validate(data);
	};
	//Export validation and schema
	return { schema, validate };
}

// Schema Definition
const getMaterialFormSchema = (JoiInstance, t, allowedUnits = ['kg'], allowedCurrencies = ['TRY']) => {
	if (!JoiInstance || typeof t !== 'function') return null;

	const materialFormSchema = JoiInstance.object({
		materialId: JoiInstance.number().min(0).required().label(t('form.materialId')),
		name: JoiInstance.string().min(3).max(100).required().label(t('form.name')),
		unit: JoiInstance.string()
			.min(1)
			.required()
			.valid(...allowedUnits)
			.label(t('form.unit')),
		density: JoiInstance.number().positive().precision(2).required().label(t('form.density')),
		tax: JoiInstance.number().min(0).precision(2).required().label(t('form.tax')),
		price: JoiInstance.number().min(0).precision(2).required().label(t('form.price')),
		priceHistory: JoiInstance.array(),
		currency: JoiInstance.string()
			.uppercase()
			.min(1)
			.valid(...allowedCurrencies)
			.required()
			.label(t('form.currency')),
	});

	return materialFormSchema;
};
