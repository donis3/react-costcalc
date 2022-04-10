import { useTranslation } from 'react-i18next';
import useCompanyInfo from '../../../context/company/useCompanyInfo';
import useIntl from '../../../hooks/common/useIntl';

export default function CompanyInfo() {
	const { t } = useTranslation('pages/company', 'translation');
	const { info } = useCompanyInfo();
	const { displayDate } = useIntl();

	return (
		// Create grid
		<div className='grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2'>
			{/* Row */}
			<CompanyInfoItem title={t('company.name')} text={info.name} />
			<CompanyInfoItem title={t('company.founder')} text={info.founder} />
			{/* Row */}
			<CompanyInfoItem title={t('company.establishedOn')} text={displayDate(info.establishedOn, { time: false })} />
			<CompanyInfoItem title={t('company.address')}>
				<p className='mt-1'>
					{info.address}
					{(info.city || info.country) && (
						<>
							<br />
							{info.city} {info.country}
						</>
					)}
				</p>
			</CompanyInfoItem>
			{/* Row */}
			<CompanyInfoItem title={t('company.phone')} text={info.phone} />
			<CompanyInfoItem title={t('company.mobile')} text={info.mobile} />
			<CompanyInfoItem title={t('company.fax')} text={info.fax} />
			<CompanyInfoItem title={t('company.email')} text={info.email} />
			<CompanyInfoItem title={t('company.website')} text={info.website} />

			{/* row */}
			<CompanyInfoItem title={t('company.taxId')} text={info.taxId} />
			{/* Row */}
			<CompanyInfoItem title={t('company.legalName')} text={info.legalName} className='col-span-full p-3' />
			<CompanyInfoItem title={t('company.about')} text={info.about} className='col-span-full p-3' />
		</div>
	);
}

function CompanyInfoItem({ title = null, text = null, children, ...attributes }) {
	if (!title) title = '';

	if (!text && !children) return <></>;
	return (
		<div className='p-3' {...attributes}>
			<h3 className='text-xs font-medium opacity-75'>{title}</h3>
			{text && <p className='mt-1 whitespace-pre-wrap leading-relaxed'>{text}</p>}
			{children}
		</div>
	);
}
