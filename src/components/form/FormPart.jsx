import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft as PreviousIcon, FaChevronRight as NextIcon, FaCheck as SubmitIcon } from 'react-icons/fa';
import useDefaultButtons from '../../hooks/forms/useDefaultButtons';

function FormPart({ children, part, controls, getValidator }) {
	if (!part || !controls || 'isActive' in part === false || 'next' in controls === false) {
		console.warn(`A form part is missing data.`);
		return <></>;
	}
	const { isActive, isFirst, isLast } = part;
	const { next, previous } = controls;
	const validator = getValidator?.();

	const handleNext = () => {
		if (typeof validator !== 'function') return next();
		const { error } = validator();
		next(error ? true : false);
	};

	const handlePrevious = () => {
		if (typeof validator !== 'function') return previous();
		const { error } = validator();
		previous(error ? true : false);
	};

	return (
		<div className={`w-full fade-in ${isActive ? '' : 'hidden'}`}>
			{/* Form Body */}
			<div className='w-full  my-5'>{children}</div>
			{/* Footer */}
			<div className='w-full flex'>
				<div className='flex-1 flex justify-start items-center'>
					{isFirst === false && <FormPartButton side='left' onClick={handlePrevious} />}
				</div>
				<div className='flex-1flex justify-end items-center'>
					{isLast ? (
						<FormPartButton side='right' type='submit' />
					) : (
						<FormPartButton side='right' onClick={handleNext} />
					)}
				</div>
			</div>
		</div>
	);
}

FormPart.defaultProps = {
	part: null,
	controls: {},
	getValidator: null,
};

function FormPartButton({ side, type, ...props }) {
	let btnClass = side === 'left' ? 'btn-outline' : 'btn-secondary';
	if (type === 'submit') btnClass = 'btn-primary';
	const { t } = useTranslation('translation');
	let text = '';
	if (type === 'button') {
		text = side === 'left' ? t('form.btnPrevious') : t('form.btnNext');
	} else {
		text = t('form.btnSubmit');
	}
	return (
		<button type={type} className={`btn btn-md ${btnClass} flex gap-x-1`} {...props}>
			{type === 'submit' && <SubmitIcon />}
			{type === 'button' && side === 'left' && <PreviousIcon />}
			{text}
			{type === 'button' && side === 'right' && <NextIcon />}
		</button>
	);
}

FormPartButton.defaultProps = {
	side: 'left',
	type: 'button',
	onClick: null,
};

function FormPartWrapper({ children, parts, controls, onReset }) {
	const { Reset } = useDefaultButtons();
	if (!parts || !controls) {
		console.warn('FormPartWrapper requires parts state & controls');
		return <>{children}</>;
	}
	//Find active step
	const activeStep = parts.find((item) => item.isActive === true).step || 1;

	const handleReset = () => {
		if (controls && controls.first && typeof controls.first === 'function') {
			controls.first();
		}
		onReset?.();
	};

	if (parts)
		return (
			<div className='w-full p-3'>
				<div className='flex justify-between gap-x-10 items-center'>
					<ul className='steps'>
						{parts.map((part, i) => {
							return (
								<Step key={i} isFilled={part.step <= activeStep} hasError={part.hasError}>
									{part.text}
								</Step>
							);
						})}
					</ul>
					{typeof onReset === 'function' && <Reset onClick={handleReset} />}
				</div>
				{children}
			</div>
		);
}
FormPartWrapper.defaultProps = {
	parts: null,
	controls: null,
	onReset: null,
};

function Step({ children, isFilled = false, hasError = false }) {
	if (isFilled) {
		//Erroneous
		if (hasError) {
			return (
				<li className='step step-secondary step-error'>
					<span className='text-red-600'>{children}</span>
				</li>
			);
		} else {
			return <li className='step step-secondary'>{children}</li>;
		}
	} else {
		return <li className='step'>{children}</li>;
	}
}

FormPart.Wrapper = FormPartWrapper;
FormPart.Button = FormPartButton;

export default FormPart;
