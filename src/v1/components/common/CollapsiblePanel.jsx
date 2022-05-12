import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CollapsiblePanel.css';
import { FaCaretDown, FaCaretLeft } from 'react-icons/fa';

export default function CollapsiblePanel({ collapsed = true, header = null, children, background = 'bg-base-300', ...props }) {
	const { t } = useTranslation('translation');
	const [isCollapsed, setCollapsed] = useState(collapsed);

	const toggleCollapse = () => setCollapsed((state) => !state);

	return (
		<div className={props?.className}>
			{/* Header */}
			<div
				className={background + ' flex justify-between p-2 items-center cursor-pointer ' + (isCollapsed ? 'rounded-md' : 'rounded-t-md')}
				onClick={toggleCollapse}
			>
				{header && header}
				<div className='flex-1 flex justify-end items-center'>
					{isCollapsed && <FaCaretLeft />}
					{!isCollapsed && <FaCaretDown />}
				</div>
			</div>
			{/* Body */}
			<div className={isCollapsed ? 'slidingPanel' : 'slidingPanel panelOpen'}>
				{/* COntent */}
				{children ? children : <span>{t('error.noData')}</span>}
			</div>
		</div>
	);
}
