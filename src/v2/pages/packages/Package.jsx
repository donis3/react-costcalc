import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import CardWithTabs from '../../components/common/CardWithTabs';


import { FaInfo as InfoIcon, FaChartLine as CostIcon } from 'react-icons/fa';
import PackageInfo from './packageDetails/PackageInfo';
import PackageCosts from './packageDetails/PackageCosts';
import DocumentDates from '../../components/common/DocumentDates';
import usePackages from '../../context/packages/usePackages';
import useApp from '../../context/app/useApp';

export default function Package() {
	const { packageId } = useParams();
	const navigate = useNavigate();
	const { page } = useApp();
	const { t } = useTranslation('pages/packages');

	const packages = usePackages();
	const pack = packages.findById(packageId);

	//Verify the package OR navigate to packages
	useEffect(() => {
		if (!pack) {
			return navigate('/notfound');
		}
		//Set breadcrumb with package name
		page.setBreadcrumb(pack?.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [packageId]);

	//Stop component if pack not found
	if (!pack) return <></>;

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
			<CardWithTabs
				tabs={tabs}
				headerContent={
					<Link to={`/packages/edit/${pack?.packageId}`}>
						<Button.Edit type='button' className='btn btn-sm' />
					</Link>
				}
				title={pack?.name}
				module='packages'
				role='view'
			/>
			<DocumentDates updatedAt={pack?.updatedAt} createdAt={pack?.createdAt} />
		</>
	);
}
