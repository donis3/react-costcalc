import { useTranslation } from 'react-i18next';
import useIntl from '../../hooks/common/useIntl';

export default function DocumentDates({ updatedAt = null, createdAt = null } = {}) {
	const { displayDate } = useIntl();
	const { t } = useTranslation('translation');

	return (
		<div className='p-1 flex justify-between'>
			{updatedAt && (
				<p className='text-xs italic opacity-50'>
					<span className='text-xs mr-1'>{t('dates.lastUpdate')}:</span>
					<span className='font-medium'>{displayDate(updatedAt)}</span>
				</p>
			)}
			{createdAt && (
				<p className='text-xs italic opacity-50'>
					<span className='text-xs mr-1'>{t('dates.createdAt')}: </span>
					<span className='font-medium'>{displayDate(createdAt)}</span>
				</p>
			)}
		</div>
	);
}
