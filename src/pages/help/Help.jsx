import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import ModuleHeader from '../../components/layout/ModuleHeader';
import useConfig from '../../hooks/app/useConfig';

export default function Help() {
	const { t } = useTranslation('pages/help');
	const config = useConfig();
	const appname = config.get('app.name');

	return (
		<>
			<Card className='w-full px-3 py-5 mb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('title', { appname })} module='help' role='other' />

				{/* About Items */}
				<HelpItem title={t('title1')}>{t('text1')}</HelpItem>
				<HelpItem title={t('title2')}>{t('text2', { appname })}</HelpItem>
				<HelpItem title={t('title3')}>{t('text3')}</HelpItem>
				<HelpItem title={t('title4')}>{t('text4')}</HelpItem>
				<HelpItem title={t('title5')}>{t('text5')}</HelpItem>
				<HelpItem title={t('title6')}>
					<Trans t={t} i18nKey='text6'>
						<p className='p-1'>text</p>
						<h1 className='font-medium p-1'>title</h1>
						<p className='p-1'>text</p>
					</Trans>
				</HelpItem>
				<HelpItem title={t('title7')}>{t('text7')}</HelpItem>
				<HelpItem title={t('title8')}>
					<ul className='p-1 list-disc list-inside italic my-3'>
						<li>{t('recipeSteps.step1')}</li>
						<li>{t('recipeSteps.step2')}</li>
						<li>{t('recipeSteps.step3')}</li>
						<li>{t('recipeSteps.step4')}</li>
						<li>{t('recipeSteps.step5')}</li>
					</ul>
					<p className='p-1'>{t('text8')}</p>
				</HelpItem>
			</Card>
		</>
	);
}

function HelpItem({ title, children }) {
	return (
		<div className='p-3 leading-relaxed'>
			<h3 className='mt-3 font-medium text-lg'>{title}</h3>
			{typeof children === 'string' ? <p className='p-1'>{children}</p> : children}
		</div>
	);
}
