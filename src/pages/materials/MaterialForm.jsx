import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FormInput from '../../components/form/FormInput';
import { FaCheck, FaTimes, FaTrashAlt } from 'react-icons/fa';
import ResponsiveModal from '../../components/common/ResponsiveModal';

//Form is handled by this hook.
import useMaterialsForm from '../../hooks/materials/useMaterialsForm';

export default function MaterialForm({
	materials = null,
	dispatch = null,
	handleClose = null,
	materialId = null,
} = {}) {
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
		deleteButtonHandler,
		config,
		priceWithTax,
	} = useMaterialsForm({
		materials: materials,
		dispatch: dispatch,
		materialId: materialId,
		onSuccess: handleClose,
		onDelete: handleClose,
	});

	//Footer Elements
	const footer = (
		<MaterialFormFooter handleClose={handleClose}>
			<MaterialFormDeleteButton deleteButtonHandler={deleteButtonHandler} onConfirmDelete={handleDelete} />
		</MaterialFormFooter>
	);

	//Main form
	return (
		<form onSubmit={(e) => onSubmitHandler(e, handleSubmit)}>
			<ResponsiveModal
				title={material ? t('form.updateTitle') : t('form.title')}
				handleCloseBtn={handleClose}
				footer={footer}
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

function MaterialFormFooter({ handleClose = null, children } = {}) {
	const { t } = useTranslation('translation');
	return (
		<div className='flex justify-between w-full'>
			<div>
				<button type='submit' className='btn btn-primary mr-2'>
					{t('buttons.save', { ns: 'translation' })}
				</button>
				<button className='btn btn-outline' onClick={handleClose}>
					{t('buttons.cancel', { ns: 'translation' })}
				</button>
			</div>
			{/* Children will have delete button if necessary */}
			{children}
		</div>
	);
}

function MaterialFormDeleteButton({ deleteButtonHandler, onConfirmDelete = null } = {}) {
	const { t } = useTranslation('translation');

	//Call the onConfirmDelete function if delete button step reaches 2
	useEffect(() => {
		if (deleteButtonHandler?.deleteButtonState?.step === 2) {
			//Delete Confirmed
			onConfirmDelete();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteButtonHandler.deleteButtonState.step]);

	if (!deleteButtonHandler) return <></>;
	const { initiateDelete, confirmDelete, resetDelete, deleteButtonState } = deleteButtonHandler;

	//Disabled Button
	if (!deleteButtonState.enabled) {
		return <></>;
	}

	switch (deleteButtonState.step) {
		case 1: {
			return (
				<div>
					<span className='mr-2 font-semibold'>{t('buttons.deleteConfirm')}</span>
					<button className='btn btn-outline' onClick={resetDelete}>
						<FaTimes className='mr-1' />
						{t('buttons.no')}
					</button>
					<button type='button' className='btn btn-outline ml-2 text-red-600' onClick={confirmDelete}>
						<FaCheck className='mr-1' />
						{t('buttons.yes')}
					</button>
				</div>
			);
		}
		case 0:
		default: {
			return (
				<button className='btn btn-error' onClick={initiateDelete}>
					<FaTrashAlt className='mr-1' />
					{t('buttons.delete')}{' '}
				</button>
			);
		}
	}
}
