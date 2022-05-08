import React, { useContext, useState } from 'react';
import Icon from '../common/Icon';
import config from '../../config/config.json';
import { useTranslation } from 'react-i18next';
import ThemeSelect from './ThemeSelect';
import AppContext from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function Footer() {
	const { t } = useTranslation('translation');
	const { theme } = useContext(AppContext);
	const [isThemeSelectOpen, setThemeSelectOpen] = useState(false);

	return (
		<>
			<footer className='items-center p-4 footer bg-neutral text-neutral-content'>
				<div className='items-center grid-flow-col'>
					<Icon icon={config.app.icon} className='w-6 h-6 fill-current' />
					<p>
						{t('footer.copyright', {
							appName: config.app.name,
							version: process.env.REACT_APP_VERSION,
							year: new Date().getFullYear(),
							owner: config.app.owner,
						})}
					</p>
					<button className='btn btn-primary btn-outline btn-xs ml-3' onClick={() => setThemeSelectOpen(true)}>
						{t(`themes.${theme.active}`, { defaultValue: theme.active })}
					</button>
				</div>

				<div className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
					<ul className='flex gap-2'>
						<li>
							<Link to='/about' className='link'>
								{t('footer.about')}
							</Link>
						</li>
						<li>
							<Link to='/help' className='link'>
								{t('footer.help')}
							</Link>
						</li>
					</ul>
				</div>
			</footer>
			<ThemeSelect isOpen={isThemeSelectOpen} setIsOpen={setThemeSelectOpen} />
		</>
	);
}
