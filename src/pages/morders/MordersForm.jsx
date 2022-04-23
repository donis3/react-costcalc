import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import Form from '../../components/forms/Form';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useMorders from '../../context/morders/useMorders';
import useMordersForm from './form/useMordersForm';

export default function MordersForm({ isEdit = false } = {}) {
	const { t } = useTranslation('pages/morders', 'translation');
	const { morders } = useMorders();
	const { uiState, getError, register, actions, select } = useMordersForm();

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('form.addTitle')} module='morders' role='add' />

				{/* Manufacturing Order Form Start */}
				<Form
					onSubmit={actions.submit}
					onReset={actions.reset}
					onDelete={isEdit ? actions.delete : null}
					setSubmitted={actions.setSubmitted}
				>
					{/* First Section */}
					<Form.Section title={t('form.firstSection')}>
						{/* End Product */}
						<Form.Control error={getError('endId')} label={t('form.endId')}>
							<Form.Select {...register({ field: 'endId', isControlled: false })} options={select.endProduct} />
						</Form.Control>

						{/* Quantity */}
						<Form.ControlGroup error={getError('quantity')} label={t('form.quantity')}>
							<Form.Number {...register({ field: 'quantity', isControlled: false })} />
							<span>{t('units.pcs', { ns: 'translation', count: uiState.quantity })}</span>
						</Form.ControlGroup>
					</Form.Section>
				</Form>
			</Card>
		</>
	);
}
