import React from 'react';
import { Link } from 'react-router-dom';
import useModuleTheme from '../../hooks/app/useModuleTheme';
import Icon from './Icon';

export default function MiniStat({ label, text, module, link }) {
	const { icon, bgColor } = useModuleTheme({ module });

	return (
		<AddLink link={link}>
			<div className='flex items-center gap-x-3 p-2 border max-w-xs justify-center'>
				<div className='flex flex-col flex-1'>
					<span className='text-xs font-light'>{label}</span>
					<span className='text-base font-bold'>{text}</span>
				</div>

				<Icon icon={icon} className='text-3xl min-w-[10px]' style={{ color: bgColor }} />
			</div>
		</AddLink>
	);
}
MiniStat.defaultProps = {
	label: '',
	text: '',
	module: 'employees',
	link: '',
};

function AddLink({ children, link = '' } = {}) {
	if (!link) {
		return <>{children}</>;
	} else {
		return <Link to={link}>{children}</Link>;
	}
}
