import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

export default function ThSortable({ children, className, field, handleSort, sortingState }) {
	//Validate sorting dependencies. If fails, return plain th
	if (!field || !handleSort || !sortingState || typeof handleSort !== 'function') {
		return <th className={className}>{children}</th>;
	}

	//Define styles
	const btnClass = 'uppercase font-semibold flex items-center gap-1 w-auto mr-1';

	//If current sort target is this cell, return with underlined btn with arrow icons
	if (sortingState.field === field) {
		return (
			<th className={className}>
				<button onClick={() => handleSort(field)} className={btnClass + ' underline'}>
					{children}
					{sortingState.asc ? <FaCaretUp className='opacity-50' /> : <FaCaretDown className='opacity-50' />}
				</button>
			</th>
		);
	}

	//If this cell is not the current sorted column, return plain button
	return (
		<th className={className}>
			<button onClick={() => handleSort(field)} className={btnClass}>
				{children}
			</button>
		</th>
	);
}

ThSortable.defaultProps = {
	className: '',
	field: null,
	handleSort: null,
	sortingState: null,
};
