import React from 'react';

export default function Card(props) {
	let cardClass = [];

	Object.keys(props).forEach((key) => {
		if (key === 'children') return;
		if (key === 'className') {
			const result = props[key].split(/(\s+)/).filter(function (e) {
				return e.trim().length > 0;
			});
			if (result.length > 0) {
				cardClass.push(...result);
			}
			return;
		}
		if (!cardClass.find((item) => item === props[key])) {
			cardClass.push(props[key]);
		}
	});

	return (
		<div className={Object.values(cardClass).join(' ')}>
			{props.children}
		</div>
	);
}

Card.defaultProps = {
	children: null,
	className: '',
	width: 'w-100',
	height: '',
	background: 'bg-base-100',
	shadow: 'shadow-md',
};
