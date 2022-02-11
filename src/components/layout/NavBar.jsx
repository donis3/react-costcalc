import React from 'react';
import config from '../../config/config.json';
import { Link, NavLink } from 'react-router-dom';
import NavThemeSelect from './NavThemeSelect';
import Icon from '../common/Icon';
import NavLanguageSelect from './NavLanguageSelect';
import { useTranslation } from 'react-i18next';

export default function NavBar() {
	const {t} = useTranslation();

	const activeLink = ({ isActive }) => {
		if (isActive) {
			return 'btn btn-primary btn-outline  btn-sm rounded-2xl ml-1';
		} else {
			return 'btn btn-ghost btn-sm rounded-2xl ml-1';
		}
	};

	return (
		<div className='navbar mb-2 shadow-lg bg-neutral text-neutral-content min-w-full'>
			<div className='flex-1 px-2 mx-2'>
				<Link to='/'>
					<Icon icon={config.app.icon} className='inline-block w-4 h-4 stroke-current mb-1' />
					<span className='text-lg font-bold ml-1'>{config.app.name}</span>
				</Link>
			</div>
			<div className='flex-none px-2 mx-2 lg:flex'>
				<div className='flex items-stretch'>
					<NavLink to='/' className={activeLink}>
						<Icon icon='FaHome' className='mr-1' />
						{t('header.home')}
					</NavLink>
					<NavLink to='/notfound' className={activeLink}>
						<Icon icon='FaExclamationCircle' className='mr-1' />
						{t('header.notfound')}
					</NavLink>
					<NavLanguageSelect />
					<NavThemeSelect />
				</div>
			</div>
		</div>
	);
}
