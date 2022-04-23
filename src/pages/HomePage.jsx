import Card from '../components/common/Card';

import 'react-day-picker/dist/style.css';
import useCompanyInfo from '../context/company/useCompanyInfo';

import TotalCost from './widgets/totalcost/TotalCost';

import ModuleGrid from './widgets/modulegrid/ModuleGrid';
import Todo from './widgets/todo/Todo';

export default function HomePage() {
	const { info } = useCompanyInfo();

	return (
		<>
			<h1 className='text-3xl lg:text-4xl font-semibold'>{info.name}</h1>
			<TotalCost />
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-md'>
				<ModuleGrid />
			</Card>

			<Card className='w-full p-0 mb-10' shadow='shadow-md'>
				<Todo />
			</Card>
		</>
	);
}
