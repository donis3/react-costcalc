import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import CardWithTabs from '../../components/common/CardWithTabs';
import { useAppContext } from '../../context/AppContext';
import { usePackagesContext } from '../../context/MainContext';
import { FaInfo as InfoIcon, FaChartLine as CostIcon } from 'react-icons/fa';
import PackageInfo from './packageDetails/PackageInfo';
import PackageCosts from './packageDetails/PackageCosts';
import DocumentDates from '../../components/common/DocumentDates';

export default function Package() {
	const { packageId } = useParams();
	const navigate = useNavigate();
	const { page } = useAppContext();
	const { t } = useTranslation('pages/packages');

	const { packages } = usePackagesContext();
	const pack = packages.findById(packageId);

	//Verify the package OR navigate to packages
	useEffect(() => {
		if (isNaN(parseInt(packageId)) || !pack) {
			return navigate('/notfound');
		}
		//Set breadcrumb with package name
		page.setBreadcrumb(pack?.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageId]);

	//Define tabs
	const tabs = [
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<InfoIcon /> {t('package.tabDetails')}
				</span>
			),
			body: <PackageInfo packageData={pack} />,
		},
		{
			name: (
				<span className='flex items-center gap-x-1'>
					<CostIcon /> {t('package.tabCosts')}
				</span>
			),
			body: <PackageCosts packageData={pack} />,
		},
	];

	//Render
	return (
		<>
			<div className='mb-1'>
				<Link to='/packages'>
					<Button.Back />
				</Link>
			</div>
			<CardWithTabs tabs={tabs} />
			<DocumentDates updatedAt={pack?.updatedAt} createdAt={pack?.createdAt} />
		</>
	);
}
