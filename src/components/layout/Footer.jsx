import React, { useContext, useState } from 'react';
import Icon from '../common/Icon';
import config from '../../config/config.json';
import { useTranslation } from 'react-i18next';
import ThemeSelect from '../navbar/ThemeSelect';
import AppContext from '../../context/AppContext';

export default function Footer() {
	const { t } = useTranslation();
	const { theme } = useContext(AppContext);
	const [isThemeSelectOpen, setThemeSelectOpen] = useState(false);

	return (
		<>
			<footer className='items-center p-4 footer bg-neutral text-neutral-content'>
				<div className='items-center grid-flow-col'>
					<Icon icon={config.app.icon} className='w-6 h-6 fill-current' />
					<p>
						{t('footer', {
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
					<Icon icon='FaInstagram' className='w-6 h-6 fill-current' />
					<Icon icon='FaFacebook' className='w-6 h-6 fill-current' />
					<Icon icon='FaYoutube' className='w-6 h-6 fill-current' />
				</div>
			</footer>
			<ThemeSelect isOpen={isThemeSelectOpen} setIsOpen={setThemeSelectOpen} />
		</>
	);
}
