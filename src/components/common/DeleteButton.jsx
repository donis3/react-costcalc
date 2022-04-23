import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

//Number of seconds to display delete button
const delay = 5;

/**
 * A delete button with confirmation before executing callback
 * @param {*} param0
 * @returns
 */
export default function DeleteButton({ small, onClick, children, ...props }) {
	const { t } = useTranslation('translation');
	const [state, setState] = useState(false);

	useEffect(() => {
		if (state === true) {
			let showDeleteConfirmTimer = setTimeout(() => setState(false), delay * 1000);
			return () => {
				clearTimeout(showDeleteConfirmTimer);
			};
		}
	}, [state]);

	//If no callback function provided, don't render button
	if (!onClick || typeof onClick !== 'function') return <></>;

	const changeState = (val = null) => {
		if (typeof val === 'boolean' && val !== state) {
			setState(val);
		}
	};

	if (state === false) {
		return children ? (
			<button type='button' {...props} onClick={() => changeState(true)}>
				{children}
			</button>
		) : (
			<BtnDelete small={small} onClick={() => changeState(true)} />
		);
	} else {
		return (
			<div className='flex gap-x-1 fade-in items-center px-1'>
				<span>{t('buttons.deleteConfirm')}</span>
				<BtnNo small={small} onClick={() => changeState(false)} />
				<BtnYes small={small} onClick={onClick} />
			</div>
		);
	}
}

function BtnNo({ small, ...props }) {
	const { t } = useTranslation('translation');
	return (
		<button type='button' className={`btn btn-outline ${small && 'btn-sm'}`} {...props}>
			<FaTimes className='mr-1' />
			{t('buttons.no')}
		</button>
	);
}

function BtnYes({ small, ...props }) {
	const { t } = useTranslation('translation');
	return (
		<button type='button' className={`btn btn-outline text-red-600 hover:bg-red-700 ${small && 'btn-sm'}`} {...props}>
			<FaCheck className='mr-1' />
			{t('buttons.yes')}
		</button>
	);
}

function BtnDelete({ small, text, ...props } = {}) {
	const { t } = useTranslation('translation');

	return (
		<button type='button' className={`fade-in btn btn-error ${small && 'btn-sm'}`} {...props}>
			{text ? (
				text
			) : (
				<>
					<FaTrash className='mr-1' />
					{t('buttons.delete')}
				</>
			)}
		</button>
	);
}

DeleteButton.defaultProps = {
	onClick: null,
	small: false,
	children: '',
};
