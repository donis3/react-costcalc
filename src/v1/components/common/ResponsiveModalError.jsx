import React from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveModal from './ResponsiveModal';

export default function ResponsiveModalError({ handleClose = null, children }) {
	const { t } = useTranslation('translation');

	return (
		<ResponsiveModal title={t('error.notFound')} handleClose={handleClose} showSubmit={false} autoFooter={true}>
			<p className='font-medium text-error-content'>{children ? children : t('error.notFoundLong')}</p>
		</ResponsiveModal>
	);
}
