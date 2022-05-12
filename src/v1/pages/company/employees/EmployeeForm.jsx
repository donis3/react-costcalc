import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/forms/Form';
import useEmployeeForm from './useEmployeeForm';
import Card from '../../../components/common/Card';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { useNavigate, useParams } from 'react-router-dom';
import useCompanyEmployees from '../../../context/company/useCompanyEmployees';
import { useAppContext } from '../../../context/AppContext';
import { toast } from 'react-toastify';

export default function EmployeeForm({ isEdit = false }) {
	const { page } = useAppContext();
	const navigate = useNavigate();
	const { t } = useTranslation('pages/company', 'translation');
	const { findById } = useCompanyEmployees();
	const { employeeId } = useParams();
	const employee = isEdit ? findById(employeeId) : null;
	const { selectData, handlers, register, getError } = useEmployeeForm(employee);

	//Set Breadcrumb on page load
	useEffect(() => {
		//Employee not found
		if (isEdit && !employee) {
			toast.warn(t('error.itemNotFound', { ns: 'translation', item: t('employees.name') }));
			navigate('/company/employees');
		}
		if (isEdit && employeeId && employee && employee?.name) {
			page.setBreadcrumb(employee.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
			<ModuleHeader
				module='employees'
				text={isEdit ? t('employees.formTitleEdit') : t('employees.formTitleAdd')}
				role={isEdit ? 'edit' : 'add'}
			/>

			{/* Body */}
			<Form onSubmit={handlers.submit} onDelete={isEdit ? handlers.delete : null} onReset={handlers.reset}>
				{/* Details Section */}
				<Form.Section title={t('employee.formSectionDetails')}>
					{/* Field: name */}
					<Form.Control label={t('employee.name')} error={getError('name')}>
						<Form.Text {...register({ field: 'name', isControlled: false })} />
					</Form.Control>
					{/* Field: department */}
					<Form.Control label={t('employee.department')} error={getError('department')}>
						<Form.Select options={selectData.departments} {...register({ field: 'department', isControlled: false })} />
					</Form.Control>
					{/* Field: date of birth (dob) */}
					<Form.Control label={t('employee.dob')} error={getError('dob')}>
						<Form.Date {...register({ field: 'dob', isControlled: true })} />
					</Form.Control>
					{/* Email */}
					<Form.Control label={t('employee.email')} error={getError('email')}>
						<Form.Text {...register({ field: 'email', isControlled: false })} />
					</Form.Control>
					{/* Mobile */}
					<Form.Control label={t('employee.mobile')} error={getError('mobile')}>
						<Form.Text {...register({ field: 'mobile', isControlled: false })} />
					</Form.Control>
					{/* Field: notes */}
					<Form.Control label={t('employee.notes')} error={getError('notes')}>
						<Form.Textarea {...register({ field: 'notes', isControlled: false })} />
					</Form.Control>
				</Form.Section>

				{/* Wage Section */}
				<Form.Section title={t('employee.formSectionWage')}>
					{/* Field: date of employment (doe) */}
					<Form.Control label={t('employee.doe')} error={getError('doe')}>
						<Form.Date {...register({ field: 'doe', isControlled: true })} />
					</Form.Control>
					<Form.Control label={t('employee.net')} error={getError('net')}>
						<Form.Number {...register({ field: 'net', isControlled: false })} />
					</Form.Control>
					<Form.Control label={t('employee.gross')} error={getError('gross')}>
						<Form.Number {...register({ field: 'gross', isControlled: false })} />
					</Form.Control>
					<Form.Control label={t('employee.currency')} error={getError('currency')}>
						<Form.Select options={selectData.currencies} {...register({ field: 'currency', isControlled: false })} />
					</Form.Control>
				</Form.Section>
			</Form>
		</Card>
	);
}

EmployeeForm.defaultProps = {
	callback: () => console.log(`Please provide callback for modal close (Employee Form)`),
};
