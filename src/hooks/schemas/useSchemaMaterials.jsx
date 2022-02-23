import useJoi from '../useJoi';
import units from '../../data/units.json';
import currencies from '../../data/currencies.json';
import { useTranslation } from 'react-i18next';

export default function useSchemaMaterials() {
	const Joi = useJoi({ abortEarly: false, convert: true });
	const { t } = useTranslation('pages/materials');

	const schema = getMaterialFormSchema(Joi, t);

	const validate = (data) => {
		return schema.validate(data);
	};
	return { schema, validate };
}

// Schema Definition
const getMaterialFormSchema = (JoiInstance, t) => {
	if (!JoiInstance || typeof t !== 'function') return null;

	const allowedUnits = [...units.mass, ...units.volume].map((unit) => unit.name);
	const allowedCurrencies = currencies.map((cur) => cur.code);

	const materialFormSchema = JoiInstance.object({
		materialId: JoiInstance.number()
			.min(0)
			.required()
			.label(t('form.materialId', { ns: 'pages/materials' })),
		name: JoiInstance.string().min(3).max(100).required().label('isim'),
		unit: JoiInstance.string()
			.min(1)
			.required()
			.valid(...allowedUnits),
		density: JoiInstance.number().positive().precision(2).required(),
		tax: JoiInstance.number().positive().precision(2).required(),
		price: JoiInstance.number().positive().precision(2).required(),
		currency: JoiInstance.string()
			.uppercase()
			.min(1)
			.valid(...allowedCurrencies)
			.required(),
	});

	return materialFormSchema;
};
