import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BiCloudUpload } from 'react-icons/bi';

import useConfig from '../../hooks/app/useConfig';

export default function Welcome() {
	const { t } = useTranslation('pages/welcome');

	const config = useConfig();
	const appname = config.get('app.name');

	return (
		<>
			<div
				className='hero min-h-[600px] bg-cover bg-center'
				style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/welcome.jpg)` }}
			>
				<div className='hero-overlay bg-opacity-75'></div>
				<div className='hero-content text-center text-neutral-content'>
					<div className='max-w-2xl'>
						{/* Welcome Title */}
						<h1 className='mb-5 text-5xl font-bold'>{t('title', { appname })}</h1>
						<p className='mb-5 text-lg'>{t('lead')}</p>

						<div className='flex gap-2 justify-center items-center'>
							<Link to='/settings' className='btn btn-primary btn-lg'>
								{t('buttons.start')}
							</Link>

							<Link to='/demo' className='btn btn-ghost btn-lg'>
								{t('buttons.demo')}
							</Link>
						</div>
						<div>
							<div className='mt-10'>
								<Link to='/system' className='btn btn-outline btn-lg gap-2'>
									<BiCloudUpload className='text-2xl' />
									{t('buttons.load')}
								</Link>
							</div>
							<p className='mt-2 text-sm opacity-50'>
								<Link to='/about'>{t('moreInfo')}</Link>
							</p>
						</div>
					</div>
				</div>
			</div>

			<a href='https://www.freepik.com/photos/money-exchange' className='text-sm font-thin p-1 mt-5'>
				Money exchange photo created by freepik - www.freepik.com
			</a>
		</>
	);
}
