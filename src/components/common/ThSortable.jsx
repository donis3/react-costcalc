import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

export default function ThSortable({ children, className, field, handleSort, sortingState, centered = null }) {
	//Default btn
	let buttonContent = <></>;
	//Define styles
	const btnClass = 'uppercase font-semibold flex items-center gap-1 w-auto mr-1';

	if (!field || !handleSort || !sortingState || typeof handleSort !== 'function') {
		//Validate sorting dependencies. If fails, return plain th
		buttonContent = children;
	} else if (sortingState.field === field) {
		//This is the column that is being sorted. Show indicator
		buttonContent = (
			<button onClick={() => handleSort(field)} className={btnClass + ' underline'}>
				{children}
				{sortingState.asc ? <FaCaretUp className='opacity-50' /> : <FaCaretDown className='opacity-50' />}
			</button>
		);
	} else {
		//If this cell is not the current sorted column, return plain button
		buttonContent = (
			<button onClick={() => handleSort(field)} className={btnClass}>
				{children}
			</button>
		);
	}

	return <th className={className}>{centered ? <CenterTh>{buttonContent}</CenterTh> : buttonContent}</th>;
}


ThSortable.defaultProps = {
	className: '',
	field: null,
	handleSort: null,
	sortingState: null,
};

//Center helper
function CenterTh({ children }) {
	const wrapperStyle = {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		justifyItems: 'center',
	};
	return <div style={wrapperStyle}>{children}</div>;
}