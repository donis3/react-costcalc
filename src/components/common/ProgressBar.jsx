import React from 'react';

export default function ProgressBar({ percentage = 0, className = '', style = {} }) {
	percentage = isNaN(parseFloat(percentage)) ? 0 : parseFloat(percentage);
	if (percentage < 0) percentage = 0;
	if (percentage > 100) percentage = 100;

	if (typeof style !== 'object' || Object.keys(style).length === 0) style = {};

	return (
		<div className='w-full bg-base-200 rounded-full h-2.5'>
			<div
				className={`h-2.5 rounded-full ${className ? className : 'bg-primary'}`}
				style={{ width: `${percentage}%`, ...style }}
			></div>
		</div>
	);

	// return (
	// 	<progress
	// 		style={style}
	// 		className={'progress ' + className}
	// 		value={Math.round(value)}
	// 		max={Math.round(max)}
	// 	></progress>
	// );
}

ProgressBar.defaultProps = {
	percentage: 0,
	className: '',
};
