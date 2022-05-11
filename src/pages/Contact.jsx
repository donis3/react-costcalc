import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCopy } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

import Card from '../components/common/Card';
import ModuleHeader from '../components/layout/ModuleHeader';
import useConfig from '../hooks/app/useConfig';

export default function Contact() {
	const { t } = useTranslation('pages/contact');
	const config = useConfig();
	const appname = config.get('app.name');
	const emailNameRef = useRef();
	const emailDomainRef = useRef();
	const copyFeedbackRef = useRef();
	const mailparts = config.get('app.contact')?.split('@');
	let showCopyTimer = null;

	//Load email by its parts to confuse email sniffers
	useEffect(() => {
		if (mailparts && Array.isArray(mailparts) && mailparts.length === 2) {
			emailNameRef.current.innerText = mailparts[0];
			emailDomainRef.current.innerText = mailparts[1];
		}
		return () => {
			if (showCopyTimer) {
				clearTimeout(showCopyTimer);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mailparts]);

	function copyEmail(name, domain) {
		if (!name || !domain) return;
		navigator.clipboard.writeText(`${name}@${domain}`);
		copyFeedbackRef.current.innerText = t('copyFeedback');
		showCopyTimer = setTimeout(() => {
			if (copyFeedbackRef && copyFeedbackRef.current) copyFeedbackRef.current.innerText = '';
		}, 1500);
	}

	return (
		<>
			<ReactTooltip effect='solid' multiline id='contact' />

			<Card className='w-full px-3 py-5 mb-10 pb-10' shadow='shadow-lg'>
				{/* Card Header */}
				<ModuleHeader text={t('title', { appname })} module='contact' role='other' />

				<p className='p-3 leading-relaxed'>{t('lead')}</p>
				<ContactItem title={t('titleBug')}>{t('textBug')}</ContactItem>
				<ContactItem title={t('titleRequest')}>{t('textRequest', { appname })}</ContactItem>

				<div className='mt-20 flex flex-col items-center gap-y-1'>
					<div className='w-full max-w-xl bg-base-300 flex text-2xl rounded-md'>
						<div className='flex-1'>
							<p className='p-5 w-full text-center'>
								<span ref={emailNameRef}></span>@<span ref={emailDomainRef}></span>
							</p>
						</div>
						<div className='w-1/4'>
							<button
								data-tip={t('copyBtn')}
								data-for='contact'
								type='button'
								onClick={() => copyEmail(...mailparts)}
								className='p-3 w-full h-full bg-black text-white opacity-10 hover:opacity-25 flex justify-center items-center rounded-r-md'
							>
								<FaCopy />
							</button>
						</div>
					</div>
					<div className='w-full max-w-xl text-right min-h-6'>
						<span className='mr-10 text-base text-primary' ref={copyFeedbackRef}></span>
					</div>
				</div>
			</Card>
		</>
	);
}

function ContactItem({ title, children }) {
	return (
		<div className='p-3 leading-relaxed'>
			<h3 className='mt-3 font-medium text-lg'>{title}</h3>
			<p className='p-1'>{children}</p>
		</div>
	);
}
