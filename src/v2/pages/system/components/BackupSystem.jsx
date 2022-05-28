import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/common/Card';
import NumericUnit from '../../../components/common/NumericUnit';
import ModuleHeader from '../../../components/layout/ModuleHeader';
import useDefaultButtons from '../../../hooks/forms/useDefaultButtons';
import useSystem from '../../../hooks/system/useSystem';

export default function BackupSystem() {
	const { Download } = useDefaultButtons();
	const { t } = useTranslation('pages/system');

	const { size, timeSinceBackup, actions } = useSystem();

	return (
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
	);
}
