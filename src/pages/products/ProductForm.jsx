import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormFooterActions } from '../../components/common/FormFooterActions';
import ResponsiveModal from '../../components/common/ResponsiveModal';
import FormInput from '../../components/form/FormInput';
import useProductsForm from '../../hooks/products/useProductsForm';

export default function ProductForm({ handleClose = null, productId = null } = {}) {
	const { t } = useTranslation('pages/products');
	const { formState, handleSubmit, handleChange, hasError, handleDelete } = useProductsForm({ productId, handleClose });

	return (
		<form onSubmit={handleSubmit}>
			<ResponsiveModal
				handleClose={handleClose}
				title={productId === null ? t('form.addTitle') : t('form.editTitle')}
				footer={<FormFooterActions handleDelete={handleDelete} handleClose={handleClose} />}
			>
				{/* FORM GRID */}
				<div className='grid md:grid-cols-2 grid-cols-1 gap-x-5 gap-y-2 mb-5 '>
					{/* Product Name */}
					<FormInput
						label={t('form.name')}
						altLabel={t('form.nameAlt')}
						className='col-span-2'
						error={hasError('name')}
					>
						<FormInput.Text name='name' value={formState.name} onChange={handleChange} />
					</FormInput>

					{/* Product Code */}
					<FormInput
						label={t('form.code')}
						altLabel={t('form.codeAlt')}
						className='col-span-2'
						error={hasError('code')}
					>
						<FormInput.Text name='code' value={formState.code} onChange={handleChange} />
					</FormInput>

					{/* Physical State */}
					<FormInput
						label={t('form.isLiquid')}
						altLabel={t('form.isLiquidAlt')}
						className='col-span-2'
						error={hasError('isLiquid')}
					>
						<FormInput.Select
							name='isLiquid'
							value={formState.isLiquid}
							onChange={handleChange}
							options={[
								{ value: true, name: t('states.liquid') },
								{ value: false, name: t('states.solid') },
							]}
						/>
					</FormInput>

					{/* density */}
					<FormInput
						label={t('form.density')}
						altLabel={t('form.densityAlt')}
						className='col-span-2'
						error={hasError('density')}
					>
						<FormInput.Text
							name='density'
							disabled={formState.isLiquid === 'false'}
							value={formState.density}
							onChange={handleChange}
							filter='number'
						/>
					</FormInput>

					{/* Production */}
					<FormInput
						label={t('form.production')}
						altLabel={t('form.productionAlt', { unit: formState.isLiquid === true ? 'L' : 'kg' })}
						className='col-span-2'
						error={hasError('production')}
					>
						<FormInput.Text name='production' value={formState.production} onChange={handleChange} filter='number' />
					</FormInput>
				</div>
			</ResponsiveModal>
		</form>
	);
}
