import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GrUserManager as EmployeeIcon, GrUserWorker as LabourIcon } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useCompany from '../../context/company/useCompany';
import useCompanyDefaults from '../../context/company/useCompanyDefaults';
import useCompanyProduction from '../../context/company/useCompanyProduction';
import useCompanyTotals from '../../context/company/useCompanyTotals';
import useConfig from '../../hooks/app/useConfig';
import useIntl from '../../hooks/common/useIntl';

import EmployeeTable from './employees/EmployeeTable';

export default function Employees() {
	const { t } = useTranslation('pages/company');

	//Calculate totals
	useCompanyProduction();
	useCompanyTotals();

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('employees.title')} module='employees' role='main'>
					<Link to='/company/employees/add'>
						<Button.New name={t('employees.name')} />
					</Link>
				</ModuleHeader>
				{/* Body */}
				<CostStat />
				<EmployeeTable />
			</Card>
		</>
	);
}

function CostStat() {
	const { company } = useCompany();
	const config = useConfig();
	const { t } = useTranslation('pages/company', 'translation');
	const { displayMoney } = useIntl();
	const defaultCurrency = config.getDefaultCurrency(true);
	const { periods, periodCoefficients } = useCompanyDefaults();
	//CUrrent period state
	const [activePeriod, setActivePeriod] = useState(periods[0]);
	const periodName = t(`periodName.${activePeriod}`, { ns: 'translation' });
	const coefficient = periodCoefficients[activePeriod];

	//Handle period change
	const onPeriodChange = (e) => {
		const p = e.target.value;
		if (periods.includes(p) === false) return;
		setActivePeriod(p);
	};

	//Default Values
	const total = { net: 0, gross: 0, currency: defaultCurrency };
	//Get real values
	if (company && company?.totals) {
		const { currency, salariesGross, salariesNet, labourGross, labourNet } = company.totals;
		total.net = salariesNet + labourNet;
		total.gross = salariesGross + labourGross;
		total.currency = currency;
		if (coefficient !== 0 && coefficient !== 1) {
			total.net = total.net / coefficient;
			total.gross = total.gross / coefficient;
		}
	}
	//Render
	return (
		<div className='flex gap-x-10'>
			<div className='stats shadow flex-1'>
				<div className='stat'>
					<div className='stat-figure text-secondary text-4xl flex'>
						<EmployeeIcon />
						<LabourIcon />
					</div>
					<div className='stat-title'>{t('employees.statTotal')}</div>
					<div className='stat-value'>{displayMoney(total.gross, total.currency)}</div>
					<div className='stat-desc'>{t('employees.statPeriod', { period: periodName })}</div>
				</div>
			</div>
			<div className='px-3'>
				<select name='activePeriod' className='select select-bordered' onChange={onPeriodChange}>
					{periods.map((item, i) => {
						return (
							<option key={i} value={item}>
								{t(`periods.${item}`, { ns: 'translation' })}
							</option>
						);
					})}
				</select>
			</div>
		</div>
	);
}
