import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import ItemDetails from '../../../components/common/ItemDetails';
import { toast } from 'react-toastify';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import { useAppContext } from '../../../context/AppContext';
import useCompanyEmployees from '../../../context/company/useCompanyEmployees';
import useCurrencyConversion from '../../../hooks/app/useCurrencyConversion';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useDateFns from '../../../hooks/common/useDateFns';

import useIntl from '../../../hooks/common/useIntl';

export default function EmployeeDetails() {
	//Data
	const { page } = useAppContext();
	const { t } = useTranslation('pages/company', 'translation');
	const { employeeId } = useParams();
	const { findById } = useCompanyEmployees();
	const employee = findById(employeeId);
	//Dependencies
	const { displayDate, displayMoney } = useIntl();
	const { convert, defaultCurrency } = useCurrencyConversion();
	const { getAge, timeSince } = useDateFns();
	const [getOption, setOption] = useUiToggles();
	const navigate = useNavigate();

	useEffect(() => {
		if (employee) {
			page.setBreadcrumb(employee.name);
		} else {
			toast.warning(t('error.itemNotFound', { ns: 'translation', item: t('employees.name') }));
			navigate('/company/employees');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Render
	if (!employee) return <></>;

	//Calculate required fields
	const isForeign = employee.currency !== defaultCurrency;
	const netLocal = isForeign ? convert(employee.net, employee.currency).amount : employee.net;
	const grossLocal = isForeign ? convert(employee.gross, employee.currency).amount : employee.gross;
	const age = getAge(employee.dob);
	const employmentTime = timeSince(employee.doe, Date.now(), { addSuffix: false });

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={employee.name} subtext={t('employee.detailsTitle')} module='employees' role='view'>
					<Link to={`/company/employees/edit/${employee?.employeeId}`}>
						<Button.Edit />
					</Link>
				</ModuleHeader>

				{/* Info Grid */}
				<ItemDetails.MainGrid>
					{/* Name & dept */}
					<ItemDetails.Item title={t('employee.name')}>{employee.name}</ItemDetails.Item>
					<ItemDetails.Item title={t('employee.department')}>
						{t(`departments.${employee.department}`)}
					</ItemDetails.Item>

					{/* Birthday & age*/}
					<ItemDetails.Item title={t('employee.dob')}>{displayDate(employee.dob, { time: false })}</ItemDetails.Item>
					<ItemDetails.Item title={t('employee.age')}>{age ? age : ''}</ItemDetails.Item>

					{/* Date of Employment & duration */}
					<ItemDetails.Item title={t('employee.doe')}>{displayDate(employee.doe, { time: false })}</ItemDetails.Item>
					<ItemDetails.Item title={t('employee.employmentTime')}>{employmentTime}</ItemDetails.Item>

					{/* Mobile & Email */}
					<ItemDetails.Item title={t('employee.email')}>{employee.email}</ItemDetails.Item>
					<ItemDetails.Item title={t('employee.mobile')}>{employee.mobile}</ItemDetails.Item>

					{/* Wage */}
					<ItemDetails.Item title={t('employee.net')}>
						{getOption('localPrice') ? displayMoney(netLocal) : displayMoney(employee.net, employee.currency)}
					</ItemDetails.Item>

					<ItemDetails.Item title={t('employee.gross')}>
						{getOption('localPrice') ? displayMoney(grossLocal) : displayMoney(employee.gross, employee.currency)}
					</ItemDetails.Item>

					{isForeign && (
						<ItemDetails.RowItem>
							<ItemDetails.Toggles setOption={setOption} getOption={getOption} options={['localPrice']} />
						</ItemDetails.RowItem>
					)}
					{/* Notes */}
					<ItemDetails.RowItem title={t('employee.notes')} pre className='col-span-full mt-10'>
						{employee.notes}
					</ItemDetails.RowItem>
				</ItemDetails.MainGrid>
			</Card>
		</>
	);
}
