import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
	const { t, i18n } = useTranslation(['translation', 'testnamespace']);
	return (
		<div className='hero h-auto mt-24'>
			<div className='text-center hero-content'>
				<div className='max-w-md'>
					<h1 className='mb-5 text-5xl font-bold'>Oops...</h1>
					<p className='mb-5 text-2xl'>We couldn't find the page you requested. Sorry for the inconvenience...</p>

					<Link to='/' className='btn btn-primary text-lg'>
						{' '}
						<FaHome className='mr-2 ' />
						Home{' '}
					</Link>
					<h3 className='mt-10 text-2xl'>i18n example</h3>
					<p>Current Language: {i18n.language}</p>
					<p className='mt-1'>{t('title', 'This is default text')}</p>
					<p className='mt-1'>{t('firstTest', { ns: 'testnamespace', defaultValue: 'Fallback Text' })}</p>
					<p className='mt-1'>
						{t('welcome', { ns: 'translation', defaultValue: 'Fallback Text', name: 'deniz', appName: 'CostApp' })}
					</p>
				</div>
			</div>
		</div>
	);
}
