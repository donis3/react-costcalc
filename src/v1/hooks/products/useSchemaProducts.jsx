import useJoi from '../common/useJoi';
import { useTranslation } from 'react-i18next';


export default function useSchemaProducts() {
	
	//Get custom joi instance
	const Joi = useJoi({ abortEarly: false, convert: true });
	//Load materials translations
	const { t } = useTranslation('pages/products');
	//Create schema
	const schema = Joi.object({
		productId: Joi.number().min(0).required().label(t('form.productId')),
		code: Joi.string().min(0).max(100).label(t('form.code')),
		name: Joi.string().min(3).max(100).required().label(t('form.name')),
        isLiquid: Joi.boolean().required(),
		density: Joi.number().positive().precision(2).required().label(t('form.density')),
		production: Joi.number().min(0).precision(2).required().label(t('form.production')),
	});

	//Define validation function
	const validate = (data) => {
		return schema.validate(data);
	};
	//Export validation and schema
	return { schema, validate };
}
