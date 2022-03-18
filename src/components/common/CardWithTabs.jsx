import React, { useState } from 'react';
import Card from './Card';
import './CardWithTabs.css';

export default function CardWithTabs({ tabs = [], className = '', headerContent = null } = {}) {
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
				<TabEmptySpace headerContent={headerContent} />
			</div>
			<div className='w-full px-3 py-5 tab-card'>
				{/* Card Body */}
				{getActiveTab(tabState.active)}
			</div>
		</Card>
	);
}

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
function TabEmptySpace({ headerContent = null } = {}) {
	if (!headerContent) return <div className='tab-empty-space'>{headerContent}</div>;
	return <div className='tab-empty-space pb-1'>{headerContent}</div>;
}
