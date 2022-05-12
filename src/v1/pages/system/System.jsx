import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTrashAlt } from 'react-icons/fa';
import Card from '../../components/common/Card';
import DeleteButton from '../../components/common/DeleteButton';
import NumericUnit from '../../components/common/NumericUnit';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useSystem from '../../hooks/app/useSystem';
import useIntl from '../../hooks/common/useIntl';
import useDefaultButtons from '../../hooks/forms/useDefaultButtons';

export default function System() {
	const { t } = useTranslation('pages/system');
	const { displayDate } = useIntl();
	const { Download, Upload, Reset } = useDefaultButtons();
	const { system, size, timeSinceBackup, actions } = useSystem();

	//===============// Reset Data Form //===============//
	const initialResetState = {
		packages: false,
		products: false,
		materials: false,
		currencies: false,
		others: false,
		employees: false,
		expenses: false,
		companydetails: false,
	};
	const [resetState, setResetState] = useState(initialResetState);
	const linkedModules = ['packages', 'materials', 'products', 'others'];
	//Reset Form Handling
	function onResetCheckboxChange(e) {
		const field = e.target?.name;
		const val = e.target.checked;
		if (!field) return;
		if (field in resetState === false) return;

		//Others & linkedModules will have the same value
		if (linkedModules.includes(field)) {
			const othersState = linkedModules.reduce((acc, key) => ({ ...acc, [key]: val }), {});
			return setResetState((state) => ({ ...state, ...othersState }));
		} else {
			return setResetState((state) => ({ ...state, [field]: val }));
		}
	}

	function isModuleDisabled(name) {
		if (!name) return;
		if (linkedModules.includes(name) === false) return;
		if (resetState.others === true) {
			return true;
		}
		return false;
	}

	function resetForm() {
		return setResetState(initialResetState);
	}

	function checkedCount() {
		return Object.keys(resetState).reduce((acc, key) => {
			if (resetState[key] === true) return acc + 1;
			return acc;
		}, 0);
	}

	function toggleAllReset() {
		const keyCount = Object.keys(resetState).length;
		const selected = Object.keys(resetState).filter((key) => {
			return resetState[key] === true;
		});
		//There is at least 1 selected: toggle all to true
		if (selected.length !== keyCount) {
			setResetState((state) => {
				return Object.keys(state).reduce((acc, key) => {
					return { ...acc, [key]: true };
				}, {});
			});
		} else {
			setResetState((state) => {
				return Object.keys(state).reduce((acc, key) => {
					return { ...acc, [key]: false };
				}, {});
			});
		}
	}

	//===============// File Upload Handler //===============//
	const fileRef = useRef();
	const handleFile = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const file = e.target.files?.[0];
		if (!file) return;
		actions.upload(file);
	};

	//===============// Render//===============//
	return (
		<>
			{/* Backup Card */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('backup.title')} module='system' role='main' customIcon='FaCloudDownloadAlt' />
				<p className='opacity-80 text-sm'>{t('backup.lead')}</p>

				<div className='grid grid-cols-2 mt-5 gap-5'>
					<div className=''>
						<h5 className='text-sm font-semibold'>{t('backup.lastBackup')}</h5>
						<p className='leading-relaxed text-base'>{timeSinceBackup ? timeSinceBackup : t('backup.never')}</p>
					</div>

					<div className=''>
						<h5 className='text-sm font-semibold'>{t('backup.dbSize')}</h5>
						<p className='leading-relaxed text-base'>
							<NumericUnit type={size.unit} short>
								{size.size}
							</NumericUnit>
						</p>
					</div>
					<div className='col-span-full border-t pt-3'>
						<Download onClick={actions.backup} />
					</div>
				</div>
			</Card>

			{/* Restore Card */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('restore.title')} module='system' role='main' customIcon='FaCloudUploadAlt' />
				<p className='opacity-80 text-sm'>{t('restore.lead')}</p>

				<div className='grid grid-cols-2 mt-5 gap-5'>
					<div className=''>
						<h5 className='text-sm font-semibold'>{t('restore.loadedFile')}</h5>
						<p className='leading-relaxed text-base'>
							{/* Show filename of last restore */}
							{system.backup.lastRestorationFilename ? system.backup.lastRestorationFilename : t('restore.notFound')}
						</p>
					</div>

					<div className=''>
						<h5 className='text-sm font-semibold'>{t('restore.loadedDate')}</h5>
						<p className='leading-relaxed text-base'>
							{system.backup.lastRestorationDate
								? displayDate(system.backup.lastRestorationDate)
								: t('restore.notFound')}
						</p>
					</div>
					<div className='col-span-full border-t pt-3'>
						<input type='file' accept='.json,text/json' ref={fileRef} className='hidden' onChange={handleFile} />
						<Upload onClick={() => fileRef.current?.click?.()} />
					</div>
				</div>
			</Card>

			{/* Reset Card */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('reset.title')} module='system' role='main' customIcon='FaExclamation'>
					<button type='button' className='btn btn-sm btn-ghost' onClick={toggleAllReset}>
						{t('reset.selectAll')}
					</button>
				</ModuleHeader>
				<p className='opacity-80 text-sm'>{t('reset.lead')}</p>

				<div className='grid grid-cols-2 mt-5 gap-5'>
					<ResetCheckboxItem
						disabled={isModuleDisabled('packages')}
						name='packages'
						checked={resetState.packages}
						onChange={onResetCheckboxChange}
					>
						{t('reset.packages')}
					</ResetCheckboxItem>

					<ResetCheckboxItem
						disabled={isModuleDisabled('materials')}
						name='materials'
						checked={resetState.materials}
						onChange={onResetCheckboxChange}
					>
						{t('reset.materials')}
					</ResetCheckboxItem>

					<ResetCheckboxItem
						disabled={isModuleDisabled('products')}
						name='products'
						checked={resetState.products}
						onChange={onResetCheckboxChange}
					>
						{t('reset.products')}
					</ResetCheckboxItem>

					<ResetCheckboxItem name='currencies' checked={resetState.currencies} onChange={onResetCheckboxChange}>
						{t('reset.currencies')}
					</ResetCheckboxItem>

					<ResetCheckboxItem name='companydetails' checked={resetState.companydetails} onChange={onResetCheckboxChange}>
						{t('reset.companydetails')}
					</ResetCheckboxItem>

					<ResetCheckboxItem name='expenses' checked={resetState.expenses} onChange={onResetCheckboxChange}>
						{t('reset.expenses')}
					</ResetCheckboxItem>

					<ResetCheckboxItem name='employees' checked={resetState.employees} onChange={onResetCheckboxChange}>
						{t('reset.employees')}
					</ResetCheckboxItem>

					<ResetCheckboxItem name='others' checked={resetState.others} onChange={onResetCheckboxChange}>
						{t('reset.others')}
					</ResetCheckboxItem>

					{checkedCount() > 0 && (
						<div className='col-span-full border-t pt-3 flex flex-col md:flex-row justify-between gap-5'>
							<DeleteButton
								onClick={() => actions.reset(resetState)}
								className='btn bg-red-500 hover:bg-red-900 flex gap-x-1'
							>
								<FaTrashAlt /> {t('reset.deleteAll')}
							</DeleteButton>

							<Reset onClick={resetForm} />
						</div>
					)}
				</div>
			</Card>
		</>
	);
}

function ResetCheckboxItem({ children, ...props }) {
	return (
		<div className=''>
			<label className='select-none flex items-center gap-x-5 py-2'>
				<input type='checkbox' className='checkbox' {...props} />
				<span className='label-text'>{children}</span>
			</label>
		</div>
	);
}
