import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import NumericUnit from '../../components/common/NumericUnit';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useSettings from '../../hooks/app/useSettings';
import useIntl from '../../hooks/common/useIntl';
import useDefaultButtons from '../../hooks/forms/useDefaultButtons';

export default function Settings() {
	const { t } = useTranslation('pages/settings');
	const { displayDate } = useIntl();
	const { Download, Upload } = useDefaultButtons();
	const { settings, size, timeSinceBackup, actions } = useSettings();
	const fileRef = useRef();

	const handleFile = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const file = e.target.files?.[0];
		if (!file) return;
		actions.upload(file);
	};

	//JSX
	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('title')} module='settings' role='other' />
				<p className='opacity-80'>{t('lead')}</p>
			</Card>

			{/* Backup Card */}
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				<ModuleHeader text={t('backup.title')} module='settings' role='main' customIcon='FaCloudDownloadAlt' />
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
				<ModuleHeader text={t('restore.title')} module='settings' role='main' customIcon='FaCloudUploadAlt' />
				<p className='opacity-80 text-sm'>{t('restore.lead')}</p>

				<div className='grid grid-cols-2 mt-5 gap-5'>
					<div className=''>
						<h5 className='text-sm font-semibold'>{t('restore.loadedFile')}</h5>
						<p className='leading-relaxed text-base'>
							{/* Show filename of last restore */}
							{settings.backup.lastRestorationFilename
								? settings.backup.lastRestorationFilename
								: t('restore.notFound')}
						</p>
					</div>

					<div className=''>
						<h5 className='text-sm font-semibold'>{t('restore.loadedDate')}</h5>
						<p className='leading-relaxed text-base'>
							{settings.backup.lastRestorationDate
								? displayDate(settings.backup.lastRestorationDate)
								: t('restore.notFound')}
						</p>
					</div>
					<div className='col-span-full border-t pt-3'>
						<input type='file' accept='.json,text/json' ref={fileRef} className='hidden' onChange={handleFile} />
						<Upload onClick={() => fileRef.current?.click?.()} />
					</div>
				</div>
			</Card>
		</>
	);
}
