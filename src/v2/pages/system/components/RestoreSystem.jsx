import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Card from '../../../components/common/Card';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import useIntl from '../../../hooks/common/useIntl';
import useDefaultButtons from '../../../hooks/forms/useDefaultButtons';
import useSystem from '../../../hooks/system/useSystem';

export default function RestoreSystem({ showCancel = false } = {}) {
	const { Upload, Cancel } = useDefaultButtons();
	const { t } = useTranslation('pages/system');
	const { displayDate } = useIntl();
	const { actions, system } = useSystem();

	//===============// File Upload Handler //===============//
	const fileRef = useRef();
	const handleFile = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const file = e.target.files?.[0];
		if (!file) return;
		actions.upload(file);
	};

	return (
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
						{system.backup.lastRestorationDate ? displayDate(system.backup.lastRestorationDate) : t('restore.notFound')}
					</p>
				</div>
				<div className='col-span-full border-t pt-3 flex gap-2'>
					<input type='file' accept='.json,text/json' ref={fileRef} className='hidden' onChange={handleFile} />
					<Upload onClick={() => fileRef.current?.click?.()} />

					{showCancel && (
						<Link to='/'>
							<Cancel className='btn btn-outline' />
						</Link>
					)}
				</div>
			</div>
		</Card>
	);
}
