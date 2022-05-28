import { useTranslation } from 'react-i18next';
import useDateFns from '../../hooks/common/useDateFns';
import useIntl from '../../hooks/common/useIntl';

export default function DocumentDates({
	updatedAt,
	createdAt,
	updatedText,
	createdText,
	showTimeSinceUpdate,
	showTimeSinceCreate,
} = {}) {
	const { displayDate } = useIntl();
	const { t } = useTranslation('translation');
	const { timeSince } = useDateFns();
	//Updated Text
	if (!updatedText) updatedText = t('dates.lastUpdate');
	let updatedAtText = null;
	if (updatedAt && showTimeSinceUpdate) {
		updatedAtText = timeSince(new Date(updatedAt));
	} else {
		updatedAtText = displayDate(updatedAt);
	}
	//Created Text
	if (!createdText) createdText = t('dates.createdAt');
	let createdAtText = null;
	if (createdAt && showTimeSinceCreate) {
		createdAtText = timeSince(new Date(createdAt));
	} else {
		createdAtText = displayDate(createdAt);
	}
	//Render
	return (
		<div className='p-1 flex justify-between mb-5'>
			{updatedAt && (
				<p className='text-xs italic opacity-50'>
					<span className='text-xs mr-1'>{updatedText}:</span>
					<span className='font-medium'>{updatedAtText}</span>
				</p>
			)}
			{createdAt && (
				<p className='text-xs italic opacity-50'>
					<span className='text-xs mr-1'>{createdText}: </span>
					<span className='font-medium'>{createdAtText}</span>
				</p>
			)}
		</div>
	);
}

DocumentDates.defaultProps = {
	updatedAt: null,
	createdAt: null,
	updatedText: null,
	createdText: null,
	showTimeSinceUpdate: null,
	showTimeSinceCreate: null,
};
