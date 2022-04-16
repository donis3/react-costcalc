import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

import useModuleTheme from '../../hooks/app/useModuleTheme';
import BackButton from '../common/BackButton';
import Icon from '../common/Icon';

export default function ModuleHeader({ children, module, text, subtext, role, backBtn, setBreadcrumb }) {
	const { icon, color, bgColor, backBtn: showBackButton } = useModuleTheme({ module, role });
	const { page } = useAppContext(setBreadcrumb ? { breadcrumb: text } : null);
	if (typeof subtext !== 'string') subtext = '';

	useEffect(() => {
		if (setBreadcrumb) {
			if (typeof setBreadcrumb === 'string') {
				page.setBreadcrumb(setBreadcrumb);
			} else {
				page.setBreadcrumb(text);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div
			className='w-full flex flex-col-reverse md:flex-row justify-between items-left md:items-center border-b-4 mb-3'
			style={{ borderColor: bgColor }}
		>
			{/* Title & Lead Text */}

			<div className='flex-1 flex gap-x-2 items-center'>
				<Icon icon={icon} style={{ color: bgColor }} className='text-2xl opacity-75' />
				<h3 className='text-2xl py-2 font-semibold flex flex-wrap items-end' style={{ color: color }}>
					<span>{text}</span>
					{subtext.length > 0 && <span className='ml-1 text-base opacity-50'>{subtext}</span>}
				</h3>
			</div>
			{/* Right side of the header*/}
			<div className='flex items-center md:justify-end gap-x-1 flex-1'>
				{(showBackButton || backBtn) && <BackButton />}
				{children}
			</div>
		</div>
	);
}

ModuleHeader.defaultProps = {
	children: null,
	text: 'Module Title',
	subtext: '',
	module: 'home',
	role: 'main',
	backBtn: null,
	setBreadcrumb: false,
};
