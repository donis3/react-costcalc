import React from 'react';
import * as FontAwesome from 'react-icons/fa';

export default function Icon({ icon, className, ...props }) {
	if (icon in FontAwesome === false) {
		console.log(`Invalid FontAwesome font requested: ${icon}`);
		className += ' text-error';
		return React.createElement(FontAwesome['FaExclamationTriangle'], );
	}
	return React.createElement(FontAwesome[icon], {icon, className, ...props});
}

Icon.defaultProps = {
	icon: 'FaHome',
	className: '',
};
