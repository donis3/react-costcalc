import Card from '../components/common/Card';
import ModuleHeader from '../components/layout/ModuleHeader';

import 'react-day-picker/dist/style.css';
import useCompanyInfo from '../context/company/useCompanyInfo';
import useIntl from '../hooks/common/useIntl';
import TotalCost from './widgets/totalcost/TotalCost';

import MiniStat from '../components/common/MiniStat';
import ModuleGrid from './widgets/modulegrid/ModuleGrid';

export default function HomePage() {
	const { displayNumber } = useIntl();
	const { info } = useCompanyInfo();

	return (
		<>
			<TotalCost />
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={info.name} module='home' role='main' />

				<ModuleGrid />
			</Card>
		</>
	);
}
