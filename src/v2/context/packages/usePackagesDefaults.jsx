import { useTranslation } from 'react-i18next';
import useJoi from '../../hooks/common/useJoi';

export const defaultPackage = {
	//Form fields
	name: '',
	productType: 'liquid',
	packageCapacity: 0,
	notes: '',
	items: [],

	/*
	Generated fields
	packageId: null,
	
	createdAt: Date.now(),
	updatedAt: Date.now(),
	cost: 0,
	currency: 0,
	tax: 0,
	costWithTax: 0,
	costHistory: [],
	unit: 'kg',
	*/
};

export default function usePackagesDefaults({ schema = {} } = {}) {
	const { t } = useTranslation('pages/packages');
	const Joi = useJoi();
	const types = ['liquid', 'solid'];

	schema.packageId = Joi.string().empty('').guid({ version: 'uuidv4' }).label(t('labels.packageId'));
	schema.name = Joi.string().min(3).max(100).required().label(t('labels.name'));
	schema.productType = Joi.string()
		.min(0)
		.max(100)
		.required()
		.valid(...types)
		.label(t('labels.productType'));
	schema.packageCapacity = Joi.number().positive().precision(2).required().label(t('labels.packageCapacity'));
	schema.notes = Joi.string().min(0).max(500).label(t('labels.notes'));
	schema.items = Joi.array().label(t('labels.item'));

	return { defaultPackage, schema };
}
