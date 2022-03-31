import React, { useState } from 'react';
import useModuleTheme from '../../hooks/app/useModuleTheme';
import BackButton from './BackButton';
import Card from './Card';
import './CardWithTabs.css';
import Icon from './Icon';

export default function CardWithTabs({ tabs, className, headerContent, module, role, title }) {
	const { icon, color, bgColor, backBtn } = useModuleTheme({ module, role });

	const [tabState, setTabState] = useState({ active: 0 });
	if (!tabs || Array.isArray(tabs) === false || tabs.length === 0) {
		return <></>;
	}

	const selectTab = (index = null) => {
		if (index === null || isNaN(parseInt(index)) || parseInt(index) >= tabs.length) return;
		setTabState((state) => ({ ...state, active: parseInt(index) }));
	};

	const getActiveTab = (active = null) => {
		if (active === null || isNaN(parseInt(active))) return <></>;
		const { body } = tabs.find((item, index) => index === active);
		return body ? body : <></>;
	};

	return (
		<>
			{module !== null && <CardHeader bgColor={bgColor} color={color} title={title} icon={icon} />}
			<Card className={className}>
				<div className='tabs '>
					{tabs.map((item, index) => {
						if (typeof item !== 'object' || Object.values(item).length !== 2) return null;
						const itemData = Object.values(item);

						return (
							<TabButton
								key={index}
								index={index}
								text={itemData[0]}
								isActive={tabState.active === index}
								selectTab={selectTab}
							/>
						);
					})}
					<TabEmptySpace headerContent={headerContent} backBtn={backBtn} />
				</div>
				<div className='w-full px-3 py-5 tab-card'>
					{/* Card Body */}
					{getActiveTab(tabState.active)}
				</div>
			</Card>
		</>
	);
}

CardWithTabs.defaultProps = {
	tabs: [],
	className: '',
	headerContent: null,
	module: null,
	role: null,
	title: 'Default Title',
};

function TabButton({ index = null, text = null, isActive = false, selectTab = null } = {}) {
	if (index === null || isNaN(parseInt(index))) return <></>;
	if (!text) text = 'Tab';
	if (typeof isActive !== 'boolean') isActive = false;
	return (
		<button type='button' className={`tab tab-lifted ${isActive && 'tab-active'}`} onClick={() => selectTab(index)}>
			{text}
		</button>
	);
}
function TabEmptySpace({ headerContent = null, backBtn = false } = {}) {
	return (
		<div className='tab-empty-space pb-1'>
			{/*  */}
			{backBtn && <BackButton />}
			{headerContent}
		</div>
	);
}

function CardHeader({ title, icon, color, bgColor }) {
	return (
		<div className='flex gap-x-2 items-center mb-3 mt-1'>
			<Icon icon={icon} style={{ color: bgColor }} className='text-2xl opacity-75' />
			<h2 className='font-medium text-2xl' style={{ color: color }}>
				{/* Tİtle */}
				{title}
			</h2>
		</div>
	);
}
CardHeader.defaultProps = { title: 'Card Title', icon: 'FaHome', color: '#000000', bgColor: '#000000' };
