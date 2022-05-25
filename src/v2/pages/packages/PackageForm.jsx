import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { FormFooterActions } from '../../components/common/FormFooterActions';
import FormInput from '../../components/form/FormInput';
import ModuleHeader from '../../components/layout/ModuleHeader';

import { validate as isUuid } from 'uuid';
import PackageFormTable from './packageForm/PackageFormTable';
import usePackagesForm from './usePackagesForm';
import Form from '../../components/forms/Form';

export default function PackageForm({ isEdit = false } = {}) {
	const { packageId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation('pages/packages', 'translation');

	const { onAddItem, onRemoveItem, formHandler, getError, register, formState } = usePackagesForm({
		packageId,
	});

	useEffect(() => {
		//verify package if this is edit mode
		if (isEdit === true && !isUuid(packageId)) {
			return navigate('/packages');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageId, isEdit]);

	//Physical States
	const physicalStates = [
		{ name: t('physicalStates.liquid', { ns: 'translation' }), value: 'liquid' },
		{ name: t('physicalStates.solid', { ns: 'translation' }), value: 'solid' },
	];

	//Render
	return (
		<>
			{/* Form */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader
					text={isEdit ? t('form.updateTitle') : t('form.addTitle')}
					module='packages'
					role={isEdit ? 'edit' : 'add'}
				/>
				<p className='opacity-80'>
					{/* Form lead depending on context */}
					{t('form.details')}
				</p>
				{/* Start Form  */}
				<Form {...formHandler}>
					{/* First Section */}
					<Form.Section key='Section1' title={t('form.subtitle')}>
						{/* Package Name */}
						<Form.Control error={getError('name')} label={t('labels.name')}>
							<Form.Text {...register({ field: 'name', isControlled: false })} />
						</Form.Control>

						{/* Product Type */}
						<Form.Control
							error={getError('productType')}
							label={t('labels.productType')}
							altLabel={t('labels.productTypeAlt')}
						>
							<Form.Select
								disabled={isEdit}
								options={physicalStates}
								{...register({ field: 'productType', isControlled: true })}
							/>
						</Form.Control>

						{/* Package Capacity */}
						<Form.ControlGroup
							error={getError('packageCapacity')}
							label={t('labels.packageCapacity')}
							altLabel={t('labels.packageCapacityAlt')}
						>
							<Form.Number {...register({ field: 'packageCapacity', isControlled: false })} />
							{/* Display Liters or Kilograms depending on current product type */}
							<span>
								{formState.productType === 'liquid'
									? t('units.L', { ns: 'translation', count: Math.round(formState.packageCapacity) })
									: t('units.kg', { ns: 'translation', count: Math.round(formState.packageCapacity) })}
							</span>
						</Form.ControlGroup>

						{/* Package Name */}
						<Form.Control error={getError('notes')} label={t('labels.notes')}>
							<Form.Textarea {...register({ field: 'notes', isControlled: false })} />
						</Form.Control>
					</Form.Section>

					<Form.Section key='Section2' title={t('form.packingItemsTitle')}>
						{/* Package Component */}
						<PackageFormTable items={formState.items} onAdd={onAddItem} onRemove={onRemoveItem} />
					</Form.Section>
				</Form>
			</Card>
		</>
	);
}
