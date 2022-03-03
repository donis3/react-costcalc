import React from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from '../../components/form/FormInput';

import ResponsiveModal from '../../components/common/ResponsiveModal';

//Form is handled by this hook.
import useMaterialsForm from '../../hooks/materials/useMaterialsForm';
import { FormFooterActions } from '../../components/common/FormFooterActions';

export default function MaterialForm({ handleClose = null, materialId = null } = {}) {
	//Hooks
	const { t } = useTranslation('pages/materials', 'translation');

	//Logic for this form
	const {
		material,
		formState,
		onSubmitHandler,
		handleChange,
		handleSubmit,
		handleDelete,
		hasError,
		config,
		priceWithTax,
	} = useMaterialsForm({ materialId: materialId, onSuccess: handleClose, onDelete: handleClose });

	//Main form
	return (
		<form onSubmit={(e) => onSubmitHandler(e, handleSubmit)}>
			<ResponsiveModal
				title={material ? t('form.updateTitle') : t('form.title')}
				handleClose={handleClose}
				footer={<FormFooterActions handleClose={handleClose} handleDelete={handleDelete} />}
			>
				{/* FORM GRID */}
				<div className='grid md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-2 mb-5 '>
					{/* Material Name */}
					<FormInput
						label={t('form.name')}
						altLabel={t('form.nameAlt')}
						className='col-span-2'
						error={hasError('name')}
					>
						<FormInput.Text name='name' value={formState.name} onChange={handleChange} />
					</FormInput>

					{/* Unit price and currency */}
					<FormInput
						label={t('form.price')}
						altLabel={t('form.priceAlt', { amount: priceWithTax().toFixed(2) })}
						className='col-span-2'
						error={[hasError('price'), hasError('currency')]}
					>
						<FormInput.Group>
							<FormInput.Text name='price' value={formState.price} onChange={handleChange} filter='number' />
							<FormInput.Select
								name='currency'
								className='select select-bordered w-auto'
								options={config.getLocalizedCurrencies({ longNames: true, symbols: true })}
								value={formState.currency}
								onChange={handleChange}
							/>
						</FormInput.Group>
					</FormInput>

					{/* Price Tax */}
					<FormInput label={t('form.tax')} altLabel={t('form.taxAlt')} className='col-span-2' error={hasError('tax')}>
						<FormInput.Text name='tax' value={formState.tax} onChange={handleChange} filter='number' />
					</FormInput>

					{/* Scale Unit  */}
					<FormInput
						label={t('form.unit')}
						altLabel={t('form.unitAlt')}
						error={hasError('unit')}
						className='md:col-span-1 col-span-2'
					>
						<FormInput.Select
							name='unit'
							options={config.getLocalizedUnitSelectOptions({ weight: true, volume: true })}
							value={formState.unit}
							onChange={handleChange}
						/>
					</FormInput>

					{/* Density */}
					<FormInput
						label={t('form.density')}
						altLabel={t('form.densityAlt', { interpolation: { escapeValue: false } })}
						error={hasError('density')}
						filter='number'
						className='md:col-span-1 col-span-2'
					>
						<FormInput.Text
							name='density'
							disabled={config.getUnitType(formState.unit) === 'weight'}
							value={formState.density}
							onChange={handleChange}
							filter='number'
						/>
					</FormInput>
				</div>
			</ResponsiveModal>
		</form>
	);
}
