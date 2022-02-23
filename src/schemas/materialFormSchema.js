import getJoi from '../lib/joi';
import i18n, { t } from '../lib/i18n';
import units from '../data/units.json';
import currencies from '../data/currencies.json';
//import tlds from '/node_modules/@sideway/address/lib/tlds.js'



const Joi = getJoi(i18n.language);

const allowedUnits = [...units.mass, ...units.volume].map((unit) => unit.name);
const allowedCurrencies = currencies.map((cur) => cur.code);

const materialFormSchema = Joi.object({
	materialId: Joi.number()
		.min(0)
		.label(t('form.materialId', { ns: 'pages/materials' })),
	name: Joi.string().min(3).max(100).required().label('isim'),
	unit: Joi.string()
		.min(1)
		.required()
		.valid(...allowedUnits),
	density: Joi.number().positive().precision(2).required(),
	tax: Joi.number().min(0).precision(2).required(),
	price: Joi.number().min(0).precision(2).required(),
	currency: Joi.string()
		.uppercase()
		.min(1)
		.valid(...allowedCurrencies)
		.required(),
});


export default materialFormSchema;

const test = {
	materialId: -2, 
	name: 's',
	unit: 'kg',
	density: '1',
	tax: '1.4',
	price: '123',
	currency: 'x',
};

const validateMaterial = (data) => {
	return materialFormSchema.validate(data);
};

const result = validateMaterial(test);
console.log(result.error.details);

