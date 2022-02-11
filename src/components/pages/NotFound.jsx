import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
	const { t } = useTranslation('pages/notfound');
	return (
		<div className='hero h-auto mt-24'>
			<div className='text-center hero-content'>
				<div className='max-w-md'>
					<h1 className='mb-5 text-5xl font-bold'>{t('title')}</h1>
					<p className='mb-5 text-2xl'>{t('message')}</p>
					<Link to='/' className='btn btn-primary text-lg'>
						<FaHome className='mr-2 ' />
						{t('homepage')}
					</Link>
				</div>
			</div>
		</div>
	);
}
