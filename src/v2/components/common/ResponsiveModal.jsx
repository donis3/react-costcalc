import React, { useEffect } from 'react';
import './Modal.css';
import { AiOutlineClose } from 'react-icons/ai';
// import AppContext from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import useApp from '../../context/app/useApp';

export default function ResponsiveModal({
	children,
	title = null,
	footer = null,
	width = 'lg:max-w-4xl',
	handleClose = null,
	showSubmit = false,
	autoFooter = false,
	icon = null,
}) {
	const { windowType } = useApp();

	//Close modal when clicked outside
	const handleOutsideClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		handleClose?.();
	};
	//Close modal when clicked on btn
	const handleButtonClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		handleClose?.();
	};
	//Don't close modal when clicked inside
	const handleInsideClick = (e) => {
		e.stopPropagation();
	};

	//Disable body scroll bar if its small screen
	useEffect(() => {
		if (['sm', 'md'].includes(windowType) === true) {
			document.body.classList.add('overflow-y-hidden');
		} else {
			document.body.classList.remove('overflow-y-hidden');
		}

		//remove class on unmount
		return () => document.body.classList.remove('overflow-y-hidden');
	}, [windowType]);

	return (
		// Wrapper Div
		<div
			className='responsive-modal lg:bg-opacity-70 bg-opacity-100 lg:bg-black bg-base-100 overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 z-50 flex justify-center items-center h-full w-full'
			onClick={handleOutsideClick}
		>
			<div className={'fade-in relative p-0   lg:h-auto lg:w-full  h-full w-full ' + width} onClick={handleInsideClick}>
				{/* Content Wrapper */}
				<div className='relative bg-base-100 lg:rounded-lg lg:shadow h-auto lg:block flex flex-col justify-between  min-h-screen lg:min-h-full'>
					{/* Show header if exists or show gap */}
					{title ? (
						<div className='flex justify-between items-center px-5 pt-5 pb-5 rounded-t border-b border-base-300'>
							{icon ? (
								<div className='flex gap-x-2 items-center'>
									{icon}
									<h3 className='text-3xl font-semibold min-h-8 lg:text-2xl'>{title}</h3>
								</div>
							) : (
								<h3 className='text-3xl font-semibold min-h-8 lg:text-2xl '>{title}</h3>
							)}
						</div>
					) : (
						<div className='h-16 lg:border-b border-base-300 flex items-center p-5'>{icon}</div>
					)}
					{/* Absolute Positioned Close Button */}
					<div className='absolute top-5 right-5  text-base-content '>
						<button type='button' className='btn-ghost rounded-md p-1' onClick={handleButtonClick}>
							<AiOutlineClose className='text-2xl' />
						</button>
					</div>
					{/* Body */}
					<div className='p-6 space-y-6 lg:overflow-y-auto lg:max-h-[700px] lg:block text-base-content flex-1'>
						{children}
					</div>
					{/* Show Modal Footer if exists OR show blank gap*/}
					{footer ? <ModalFooter>{footer}</ModalFooter> : <div className='lg:h-10'></div>}
					{autoFooter && <ModalFooterAuto showSubmit={showSubmit} handleClose={handleClose} />}
				</div>
			</div>
		</div>
	);
}

//Auto generate a form submit button and a close modal button
const ModalFooterAuto = ({ handleClose = null, showSubmit = null } = {}) => {
	const { t } = useTranslation('translation');
	if ((!handleClose || typeof handleClose !== 'function') && !showSubmit) {
		return <></>;
	}

	return (
		<ModalFooter>
			{/* Show Submit Btn */}
			{showSubmit && (
				<button type='submit' className='btn btn-primary'>
					{t('buttons.submit')}
				</button>
			)}
			{/* Show Close Btn */}
			{handleClose && typeof handleClose === 'function' && (
				<button type='button' className='btn btn-ghost btn-outline' onClick={handleClose}>
					{t('buttons.close')}
				</button>
			)}
		</ModalFooter>
	);
};

const ModalFooter = ({ children }) => {
	return (
		<div className='flex justify-start items-center p-6 space-x-2 rounded-b border-t border-base-300 bg-base-100'>
			{children}
		</div>
	);
};
