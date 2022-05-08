import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/common/Card';
import ModuleHeader from '../components/layout/ModuleHeader';
import useConfig from '../hooks/app/useConfig';

export default function About() {
	const { t } = useTranslation('pages/about');
	const config = useConfig();
	const appname = config.get('app.name');
	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('title', { appname })} module='about' role='other' />

				{/* About Items */}
				<AboutItem title={t('title1', { appname })}>{t('title1Text')}</AboutItem>
				<AboutItem title={t('title2')}>{t('title2Text')}</AboutItem>
				<AboutItem title={t('title3')}>{t('title3Text')}</AboutItem>
				<AboutItem title={t('title4')}>{t('title4Text')}</AboutItem>
				<AboutItem title={t('title5')}>{t('title5Text')}</AboutItem>
				<AboutItem title={t('title6')}>{t('title6Text')}</AboutItem>
			</Card>
		</>
	);
}

function AboutItem({ title, children }) {
	return (
		<div className='p-3 leading-relaxed'>
			<h3 className='mt-3 font-medium text-lg'>{title}</h3>
			<p className='p-1'>{children}</p>
		</div>
	);
}
