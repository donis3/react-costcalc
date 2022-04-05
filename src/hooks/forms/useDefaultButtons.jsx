import React from 'react';
import { useTranslation } from 'react-i18next';
import * as FontAwesome from 'react-icons/fa';

export default function useDefaultButtons() {
	const { t, i18n } = useTranslation('translation');

	function Submit({ children, icon = 'FaCheck', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='submit' className='btn btn-primary' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.submit')}
			</button>
		);
	}

	function Reset({ children, icon = 'FaUndo', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='button' className='btn btn-outline ' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.reset')}
			</button>
		);
	}

	function Delete({ children, icon = 'FaTrash', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='button' className='btn btn-error' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.delete')}
			</button>
		);
	}

	function ConfirmYes({ children, icon = 'FaCheck', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='button' className='btn btn-primary btn-outline' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.yes')}
			</button>
		);
	}

	function ConfirmNo({ children, icon = 'FaTimes', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='button' className='btn btn-outline' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.no')}
			</button>
		);
	}

	function Edit({ children, icon = 'FaPencilAlt', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='button' className='btn btn-outline btn-sm ' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.edit')}
			</button>
		);
	}

	function Cancel({ children, icon = 'FaTimes', text = '', ...props }) {
		if (typeof text !== 'string') text = '';
		if (i18n.exists(text)) text = t(text);
		if (i18n.exists('buttons.' + text)) text = t('buttons.' + text);
		if (!children) children = text;

		return (
			<button type='button' className='btn btn-sm ' {...props}>
				{icon && typeof icon === 'string' ? <FaIcon icon={icon} /> : null}
				{children ? children : t('buttons.cancel')}
			</button>
		);
	}

	return {
		Submit,
		Delete,
		ConfirmYes,
		ConfirmNo,
		Reset,
		Edit,
		Cancel,
	};
}

function FaIcon({ icon = 'FaHome', className = 'mr-1', ...props }) {
	if (icon in FontAwesome === false) {
		return React.createElement(FontAwesome['FaExclamationTriangle']);
	}
	return React.createElement(FontAwesome[icon], { icon, className, ...props });
}
