import Card from '../components/common/Card';
import ReactTooltip from 'react-tooltip';
import 'react-day-picker/dist/style.css';
import useCompanyInfo from '../context/company/useCompanyInfo';

import TotalCost from './widgets/totalcost/TotalCost';

import ModuleGrid from './widgets/modulegrid/ModuleGrid';
import Todo from './widgets/todo/Todo';
import { useTranslation } from 'react-i18next';
import { GoSettings } from 'react-icons/go';
import { Link } from 'react-router-dom';

export default function HomePage() {
	const { t } = useTranslation('pages/homepage');
	const { info } = useCompanyInfo();
	
	return (
		<>
			<ReactTooltip effect='solid' multiline id='homepage' />
			<div className='flex flex-wrap justify-between items-center'>
				<h1 className='text-3xl lg:text-4xl font-semibold'>{info.name}</h1>
				<Link to='/settings'>
					<button
						type='button'
						className='btn btn-sm btn-ghost'
						data-tip={t('buttons.settingsTip')}
						data-for='homepage'
					>
						{t('buttons.settings')}
						<GoSettings className='ml-1' />
					</button>
				</Link>
			</div>
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
