import React, { useState } from 'react';
import {
	GrUserManager as EmployeeIcon,
	GrUserWorker as LabourIcon,
	GrOrganization as CompanyIcon,
	GrMoney as LabourCostIcon,
} from 'react-icons/gr';
import { GiStack as ProductionIcon } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';
import useIntl from '../../../hooks/common/useIntl';
import { FaCog, FaHome, FaQuestionCircle } from 'react-icons/fa';
import FocusTrap from 'focus-trap-react';
import useCompanyDefaults from '../../../context/company/useCompanyDefaults';
import useUiToggles from '../../../hooks/app/useUiToggles';
import useTotalCost from './useTotalCost';
import ReactTooltip from 'react-tooltip';
import NumericUnit from '../../../components/common/NumericUnit';
import { Link } from 'react-router-dom';

export default function TotalCost() {
	const { t } = useTranslation('pages/homepage', 'translation');
	const { displayMoney } = useIntl();
	const [getOption, setOption] = useUiToggles();
	const { labour, overhead, updatedAt, production, combined } = useTotalCost({ period: getOption('showPeriod') });
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
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-20'>
				{/* Combined Cost (Total Cost) */}
				<Stat
					desc={t('totals.periodText', { period: periodName })}
					icon={[<EmployeeIcon />, <LabourIcon />, <CompanyIcon />]}
					label={t('totals.combined')}
					helpText={t('help.combined', {
						overhead: displayMoney(overhead.totalWithTax, overhead.currency),
						labour: displayMoney(labour.totalWithTax, labour.currency),
					})}
				>
					{displayMoney(combined.totalWithTax, combined.currency)}
				</Stat>

				{/* <Stat
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
				</Stat> */}

				<Stat
					label={t('totals.production')}
					icon={<ProductionIcon />}
					helpText={t('help.production')}
					desc={t('totals.periodText', { period: periodName })}
				>
					<Link to='/products'>
						<NumericUnit type={production.unit} short autoTonne autoTonneAfter={10000}>
							{production.production}
						</NumericUnit>
					</Link>
				</Stat>

				{/* Labour cost per unit produced */}
				<Stat
					label={t('totals.labourUnitCost')}
					icon={<LabourCostIcon />}
					helpText={t('help.labourUnitCost')}
					desc={t('totals.labourUnitCostDesc', { unit: t(`units.${production.unit}`, { ns: 'translation' }) })}
				>
					<NumericUnit type={production.unit} short isPer>
						{displayMoney(production.labour)}
					</NumericUnit>
				</Stat>

				{/* Overhead per unit produced */}
				<Stat
					label={t('totals.overheadUnitCost')}
					icon={<LabourCostIcon />}
					helpText={t('help.overheadUnitCost')}
					desc={t('totals.overheadUnitCostDesc', { unit: t(`units.${production.unit}`, { ns: 'translation' }) })}
				>
					<NumericUnit type={production.unit} short isPer>
						{displayMoney(production.overhead)}
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
				<div className='stat-figure  text-2xl flex'>
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
			<div className='stat-desc whitespace-normal'>{desc}</div>
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
			<button type='button' className='absolute right-2 top-2 z-10' onClick={handleOpen}>
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
