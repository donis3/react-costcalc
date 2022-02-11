import React from 'react';
import * as FontAwesome from 'react-icons/fa';


export default function Icon(props) {
	if (props.icon in FontAwesome === false) {
		console.log(`Invalid FontAwesome font requested: ${props.icon}`);
        props.className += " text-error";
		return React.createElement(FontAwesome['FaExclamationTriangle'], props)
	}
	return React.createElement(FontAwesome[props.icon], props);
	
}

Icon.defaultProps = {
	icon: 'FaHome',
};
