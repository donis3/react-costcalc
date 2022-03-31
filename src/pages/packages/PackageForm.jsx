import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { FormFooterActions } from '../../components/common/FormFooterActions';
import FormInput from '../../components/form/FormInput';
import ModuleHeader from '../../components/layout/ModuleHeader';

import usePackagesForm from '../../hooks/packages/usePackagesForm';
import PackageFormTable from './packageForm/PackageFormTable';

export default function PackageForm({ isEdit = false } = {}) {
	const { packageId } = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation('pages/packages', 'translation');

	const { formState, onChangeHandler, hasError, onSubmit, onAddItem, onRemoveItem, resetForm, onDelete } =
		usePackagesForm({
			packageId,
		});

	useEffect(() => {
		//verify package if this is edit mode
		if (isEdit === true && isNaN(parseInt(packageId))) {
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
			<Card className='w-100 px-3 py-5' shadow='shadow-lg'>
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

				<form onSubmit={onSubmit} className='w-full mt-10'>
					{/* Form Start*/}

					{/* Flex Container for form */}
					<div className='flex flex-col justify-start gap-10 items-start xl:flex-row gap-y-20 xl:gap-y-0 gap-x-10'>
						{/* Package Definitions Section */}
						<div className='w-full flex flex-col gap-y-5 max-w-lg md:max-w-2xl'>
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.subtitle')}</h1>

							{/* name */}
							<FormInput label={t('labels.name')} error={hasError('name')}>
								<FormInput.Text name='name' onChange={onChangeHandler} value={formState.name} />
							</FormInput>
							{isEdit === false ? (
								<FormInput
									label={t('labels.productType')}
									error={hasError('productType')}
									altLabel={t('labels.productTypeAlt')}
								>
									<FormInput.Select
										name='productType'
										options={physicalStates}
										onChange={onChangeHandler}
										value={formState.productType}
									/>
								</FormInput>
							) : (
								<FormInput label={t('labels.productType')}>
									<input
										type='text'
										disabled
										className='input input-bordered'
										value={t('physicalStates.' + formState.productType, { ns: 'translation' })}
									/>
								</FormInput>
							)}
							{/* capacity */}
							<FormInput
								label={t('labels.packageCapacity')}
								error={hasError('packageCapacity')}
								altLabel={t('labels.packageCapacityAlt')}
							>
								<FormInput.Group>
									<FormInput.Text
										name='packageCapacity'
										filter='number'
										onChange={onChangeHandler}
										value={formState.packageCapacity}
									/>
									{/* Unit depends on physical state kg/L */}
									<span>
										{formState.productType === 'liquid'
											? t('units.L', { ns: 'translation', count: Math.round(formState.packageCapacity) })
											: t('units.kg', { ns: 'translation', count: Math.round(formState.packageCapacity) })}
									</span>
								</FormInput.Group>
							</FormInput>
							{/* Notes */}
							<FormInput label={t('labels.notes')} error={hasError('notes')}>
								<FormInput.Textarea name='notes' rows='1' onChange={onChangeHandler} value={formState.notes} />
							</FormInput>
						</div>

						{/* Package Items */}
						<div className='w-full flex flex-col gap-y-5  max-w-lg md:max-w-4xl'>
							<h1 className='text-xl m-0 p-0 border-b-8'>{t('form.packingItemsTitle')}</h1>

							{/* Package Component */}
							<PackageFormTable items={formState.items} onAdd={onAddItem} onRemove={onRemoveItem} />
						</div>
					</div>
					{/* Form Footer */}

					<FormFooterActions className='mt-10 border-t-2 py-5' handleDelete={isEdit ? onDelete : null}>
						<Button.Save className='btn btn-primary btn-md mr-1' type='submit' />
						<Button.Reset className='btn btn-md' type='button' onClick={resetForm} />
					</FormFooterActions>
				</form>
			</Card>
		</>
	);
}
