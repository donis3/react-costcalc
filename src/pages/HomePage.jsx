import Card from '../components/common/Card';
import ModuleHeader from '../components/layout/ModuleHeader';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import useCompanyInfo from '../context/company/useCompanyInfo';
import useIntl from '../hooks/common/useIntl';

export default function HomePage() {
	const { displayNumber } = useIntl();
	let arr = [];
	for (let i = 0; i < 10; i++) {
		arr[i] = 'Dynamic Content Height Generation - Row: ' + (i + 1);
	}
	const { info } = useCompanyInfo();

	const size = new Blob(Object.values(localStorage)).size;

	return (
		<Card className='w-full px-3 py-5 ' shadow='shadow-lg'>
			{/* Card Header */}
			<ModuleHeader text={info.name} module='home' role='main' />

			<p className='p-2 leading-relaxed'>Welcome to cost calculator.</p>
			<p>current local storage size: {displayNumber(size / 1024, 2)} kb</p>
			<ul>
				<li>TODO</li>
				<li>Endproduct Form : slow</li>
				<li>Packages Form : slow</li>
				<li>Recipes Form : slow</li>
			</ul>

			<DayPicker />
		</Card>
	);
}
