import React from 'react';
import Icon from '../common/Icon';
import config from '../../config/config.json';
import { useTranslation } from 'react-i18next';

export default function Footer() {
	const { t } = useTranslation();

	return (
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
			</div>
			<div className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
				<Icon icon='FaInstagram' className='w-6 h-6 fill-current' />
				<Icon icon='FaFacebook' className='w-6 h-6 fill-current' />
				<Icon icon='FaYoutube' className='w-6 h-6 fill-current' />
			</div>
		</footer>
	);
}
