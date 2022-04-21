import React, { useState } from 'react';
import useCompany from '../../../context/company/useCompany';
import useConfig from '../../../hooks/app/useConfig';
import {
	GrUserManager as EmployeeIcon,
	GrUserWorker as LabourIcon,
	GrOrganization as CompanyIcon,
	GrServices as ProductionIcon,
	GrMoney as LabourCostIcon,
} from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import useIntl from '../../../hooks/common/useIntl';
import { FaCog, FaHome, FaQuestionCircle } from 'react-icons/fa';
import FocusTrap from 'focus-trap-react';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useTotalCost from './useTotalCost';
import ReactTooltip from 'react-tooltip';
import NumericUnit from '../../../components/common/NumericUnit';

export default function TotalCost() {
	const { t } = useTranslation('pages/homepage', 'translation');
	const { displayMoney } = useIntl();
	const [getOption, setOption] = useUiToggles();
	const { labour, overhead, updatedAt, production } = useTotalCost({ period: getOption('showPeriod') });
	const periodName = t(`periodName.${getOption('showPeriod')}`, { ns: 'translation' });

	return (
		<div className='relative w-full bg-base-100 my-3 shadow-md border rounded-lg px-3 pt-3 pb-6 flex justify-start sm:justify-center'>
			{/* Tooltip Container */}
			<ReactTooltip effect='solid' multiline id='totalcost' />
			{/* Period Select Dropdown */}
			<PeriodSelect setOption={setOption} getOption={getOption} />
			{/* Updated Text */}
			<UpdatedAtText updatedAt={updatedAt} />
			{/* Stat Grid */}
			<div className='w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-20'>
				<Stat
					desc={t('totals.periodText', { period: periodName })}
					icon={[<EmployeeIcon />, <CompanyIcon />]}
					label={t('totals.overhead')}
					helpText={t('help.overhead')}
				>
					{displayMoney(overhead.totalWithTax, overhead.currency)}
				</Stat>

				<Stat
					desc={t('totals.periodText', { period: periodName })}
					icon={<LabourIcon />}
					label={t('totals.labour')}
					helpText={t('help.labour')}
				>
					{displayMoney(labour.totalWithTax, labour.currency)}
				</Stat>

				<Stat
					label={t('totals.production')}
					icon={<ProductionIcon />}
					helpText={t('help.production')}
					desc={t('totals.periodText', { period: periodName })}
				>
					<NumericUnit type={production.unit} short>
						{production.production}
					</NumericUnit>
				</Stat>

				<Stat
					label={t('totals.productionUnitCost')}
					icon={<LabourCostIcon />}
					helpText={t('help.productionUnitCost')}
					desc={t('totals.productionUnitCostDesc', { unit: t(`units.${production.unit}`, { ns: 'translation' }) })}
				>
					<NumericUnit type={production.unit} short isPer>
						{displayMoney(production.cost)}
					</NumericUnit>
				</Stat>
			</div>
		</div>
	);
}

function Stat({ children, label, desc, helpText, icon }) {
	return (
		<div className='stat'>
			{/* Stat Icon or Array of Icons */}
			{icon && (
				<div className='stat-figure text-secondary text-2xl flex'>
					{Array.isArray(icon) ? icon.map((item, i) => React.cloneElement(item, { key: i })) : icon}
				</div>
			)}

			{/* Stat Title */}
			<div className='stat-title text-sm  flex items-center gap-x-1'>
				{label}
				{/* Help Text */}
				{helpText && (
					<button type='button' data-tip={helpText} data-for='totalcost'>
						<FaQuestionCircle />
					</button>
				)}
			</div>
			{/* Stat Value */}
			<div className='stat-value text-lg'>{children}</div>
			{/* Stat Description */}
			<div className='stat-desc'>{desc}</div>
		</div>
	);
}
Stat.defaultProps = {
	label: '',
	desc: '',
	helpText: '',
	icon: <FaHome />,
};

function UpdatedAtText({ updatedAt }) {
	const { t } = useTranslation('translation');
	const { displayDate } = useIntl();

	if (!updatedAt) return <></>;
	return (
		<div className='absolute bottom-0 right-0'>
			<p className='text-xs opacity-70 p-1 italic'>
				{t('dates.lastUpdate')} {displayDate(updatedAt)}
			</p>
		</div>
	);
}

/**
 * Add a dropdown with periods to select
 * will change uiToggle showPeriod data
 * requires useUiToggles setter and getter
 * @param {*} param0
 * @returns
 */
function PeriodSelect({ setOption, getOption }) {
	const [isActive, setIsActive] = useState(false);
	const handleOpen = () => setIsActive(true);
	const handleClose = () => setIsActive(false);
	const { periods } = useCompanyDefaults();
	const { t } = useTranslation('translation');
	const activePeriod = getOption?.('showPeriod');

	const handleChange = (newPeriod) => {
		handleClose();
		if (periods.includes(newPeriod)) setOption?.('showPeriod', newPeriod);
	};

	return (
		<>
			<button type='button' className='absolute right-2 top-2 z-50' onClick={handleOpen}>
				<FaCog />
			</button>
			{isActive && (
				<FocusTrap
					active
					focusTrapOptions={{
						initialFocus: false,
						allowOutsideClick: true,
						clickOutsideDeactivates: true,
						onDeactivate: handleClose,
					}}
				>
					<div className='absolute right-4 top-6 z-50 '>
						<ul className='flex flex-col py-2 px-5 gap-y-1 shadow-md rounded-box bg-base-100 w-auto border'>
							{periods.map((period, i) => {
								return (
									<button
										onClick={() => handleChange(period)}
										type='button'
										className={`link-hover ${period === activePeriod && 'link-secondary'}`}
										key={i}
									>
										{t(`periods.${period}`)}
									</button>
								);
							})}
						</ul>
					</div>
				</FocusTrap>
			)}
		</>
	);
}
