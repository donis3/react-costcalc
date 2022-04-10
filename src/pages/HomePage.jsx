import Card from '../components/common/Card';
import ModuleHeader from '../components/layout/ModuleHeader';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import useCompanyInfo from '../context/company/useCompanyInfo';

export default function HomePage() {
	let arr = [];
	for (let i = 0; i < 10; i++) {
		arr[i] = 'Dynamic Content Height Generation - Row: ' + (i + 1);
	}
	const { info } = useCompanyInfo();

	return (
		<Card className='w-full px-3 py-5 ' shadow='shadow-lg'>
			{/* Card Header */}
			<ModuleHeader text={info.name} module='home' role='main' />

			<p className='p-2 leading-relaxed'>Welcome to cost calculator.</p>

			<DayPicker />
		</Card>
	);
}
