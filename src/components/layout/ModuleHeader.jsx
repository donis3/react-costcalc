import React from 'react';

import useModuleTheme from '../../hooks/app/useModuleTheme';
import BackButton from '../common/BackButton';
import Icon from '../common/Icon';

export default function ModuleHeader({ children, module, text, role, backBtn }) {
	const { icon, color, bgColor, backBtn: showBackButton } = useModuleTheme({ module, role });

	return (
		<div className='w-full flex justify-between items-center border-b-4 mb-3' style={{ borderColor: bgColor }}>
			{/* Title & Lead Text */}

			<div className='flex-1 flex gap-x-2 items-center'>
				<Icon icon={icon} style={{ color: bgColor }} className='text-2xl opacity-75' />
				<h3 className='text-2xl py-2 font-semibold' style={{ color: color }}>
					{text}
				</h3>
			</div>
			{/* Right side of the header*/}
			<div className='flex items-center gap-x-1'>
				{(showBackButton || backBtn) && <BackButton />}
				{children}
			</div>
		</div>
	);
}

ModuleHeader.defaultProps = {
	children: null,
	text: 'Module Title',
	module: 'home',
	role: 'main',
	backBtn: null,
};
