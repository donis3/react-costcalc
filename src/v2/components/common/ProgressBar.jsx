import React from 'react';

const colors = ['#5AA469', '#EFB08C', '#D35D6E'];

export default function ProgressBar({ percentage = 0, className = '', style = {}, colorize = false }) {
	percentage = isNaN(parseFloat(percentage)) ? 0 : parseFloat(percentage);
	if (percentage < 0) percentage = 0;
	if (percentage > 100) percentage = 100;

	if (typeof style !== 'object' || Object.keys(style).length === 0) style = {};

	let colorStyle = {};
	
	if (colorize) {
		colorStyle = { backgroundColor: colors[0] };
		if (percentage > 60 && percentage <= 85) {
			colorStyle.backgroundColor = colors[1];
		} else if (percentage > 85) {
			
			colorStyle.backgroundColor = colors[2];
		}
	}

	return (
		<div className='w-full bg-base-300 rounded-full h-2.5'>
			<div
				className={`h-2.5 rounded-full ${className ? className : 'bg-primary'}`}
				style={{ width: `${percentage}%`, ...colorStyle, ...style }}
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
