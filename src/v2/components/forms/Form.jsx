import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDefaultButtons from '../../hooks/forms/useDefaultButtons';
import './Form.css';
import InputNumber from './InputNumber';
import InputSelect from './InputSelect';
import InputText from './InputText';
import InputDate from './InputDate';
import InputTextarea from './InputTextarea';
import InputCheckbox from './InputCheckbox';

function Form({ children, colsSmall, colsLarge, onSubmit, onReset, onDelete, setSubmitted, footer, grid, ...props }) {
	function handleSubmit(e) {
		e.preventDefault();
		setSubmitted?.((state) => true);

		//Call provided submit function
		onSubmit(e);
	}

	return (
		<form onSubmit={handleSubmit} className='w-full mt-10' {...props}>
			{grid ? (
				<Grid colsSmall={colsSmall} colsLarge={colsLarge}>
					{/* Sections */}
					{children}
					{/* Footer */}
					{footer && <DefaultFooter handleReset={onReset} handleDelete={onDelete} />}
				</Grid>
			) : (
				<>
					{children}
					{footer && <DefaultFooter handleReset={onReset} handleDelete={onDelete} />}
				</>
			)}
		</form>
	);
}
Form.defaultProps = {
	colsSmall: 1,
	colsLarge: 2,
	onSubmit: () => console.log('Please provide onSubmit callback'),
	onReset: null,
	onDelete: null,
	setSubmitted: () => {},
	footer: true,
	grid: true,
};

/**
 * A customizable grid for form building.
 * Form structure is :
 * Grid > Section > Control > Input
 * @param colsSmall column number 1-12 for small screens. Default 1
 * @param colsLarge column number 1-12 for large screens. Default 2
 */
function Grid({ children, colsSmall = 1, colsLarge = 2, ...props }) {
	//Column number must be 0 < X < 13
	colsSmall = parseInt(colsSmall);
	colsLarge = parseInt(colsLarge);
	if (isNaN(colsSmall) || colsSmall <= 0) colsSmall = 1;
	if (colsSmall > 12) colsSmall = 12;

	if (isNaN(colsLarge) || colsLarge <= 0) colsLarge = 1;
	if (colsLarge > 12) colsLarge = 12;

	if (colsLarge < colsSmall) colsLarge = colsSmall;

	if (colsLarge !== colsSmall) {
		//we need media queries
		return (
			<div className={`grid grid-cols-${colsSmall} lg:grid-cols-${colsLarge} gap-x-10 gap-y-8`} {...props}>
				{/* Content */}
				{children}
			</div>
		);
	} else {
		return (
			<div className={`grid grid-cols-1 gap-x-10 gap-y-8`} {...props}>
				{/* Content */}
				{children}
			</div>
		);
	}
}

/**
 * A Form Section block with title.
 * Create col-span-2 or larger sections using className override
 *
 * <FormBlocks.Section title={'Section Title'} className="col-span-full lg:col-span-2" >
 */
function Section({ children, title = null, ...props }) {
	return (
		<div className='col-span-full lg:col-span-1' {...props}>
			{title && <h1 className='text-xl m-0 p-0 border-b-8 mb-3'>{title}</h1>}
			{/* Children */}
			<div className='flex flex-col gap-y-2'>
				{/* All children are in flex col */}
				{children}
			</div>
		</div>
	);
}

/**
 * A form input wrapper with label and alt label. Will also show errors if needed
 * Wrap each input with this inside FormBlock.Grid
 */
function Control({ children, label = null, altLabel = null, error = '', noLabel = false, className = '' }) {
	if (typeof error !== 'string') error = '';

	return (
		<div className={`form-control w-full ${error.length > 0 ? 'form-error' : ''}  ${className}`}>
			{noLabel === false && (
				<label className='label'>
					{/* Main Label */}
					<span className='label-text'>{label}</span>
				</label>
			)}
			{/* Input as children */}
			{children}
			<label className='label label-bottom'>
				{/* Display Error Label if needed */}
				{error.length > 0 && <span className='error-text' dangerouslySetInnerHTML={{ __html: error }} />}
				{/* If no error, display altLabel */}
				{error.length === 0 && altLabel && (
					<span className='label-text-alt' dangerouslySetInnerHTML={{ __html: altLabel }} />
				)}
			</label>
		</div>
	);
}

/**
 * A group for multiple form items
 * First item in the group will have flex-1 class and expand as much as it can
 * error can be an array to display multiple errors
 *
 */
function GroupControl({ children, label, altLabel, error, noLabel, className, large }) {
	let errorText = '';
	if (Array.isArray(error) && error.length > 0) {
		errorText = error.reduce((acc, current) => {
			if (typeof current !== 'string') return acc;
			if (current.trim().length === 0) return acc;
			if (acc.trim().length > 0) return `${acc} \n${current}`;
			return current.trim();
		}, '');
	} else if (typeof error === 'string' && error.trim().length > 0) {
		errorText = error.trim();
	} else {
		errorText = '';
	}

	return (
		<div className={`form-control form-control-group w-full ${errorText.length > 0 ? 'form-error' : ''} ${className}`}>
			{noLabel === false && (
				<label className='label'>
					{/* Main Label */}
					{label && <span className='label-text'>{label}</span>}
				</label>
			)}
			<div className={`input-group ${large ? 'w-full' : 'max-w-fit'} `}>
				{/* Input as children */}
				{children}
			</div>
			<label className='label label-bottom'>
				{/* Display Error Label if needed */}
				{errorText.length > 0 && <span className='error-text'>{errorText}</span>}
				{/* If no error, display altLabel */}
				{errorText.length === 0 && altLabel && (
					<span className='label-text-alt' dangerouslySetInnerHTML={{ __html: altLabel }} />
				)}
			</label>
		</div>
	);
}
GroupControl.defaultProps = {
	label: null,
	altLabel: null,
	error: '',
	noLabel: false,
	className: '',
	large: false,
};

/**
 * A form footer wrapper
 * @param {*} param0
 * @returns
 */
function Footer({ children, styled = false, ...props }) {
	if (!styled) {
		return (
			<div className='col-span-full w-full flex   gap-x-5 justify-between ' {...props}>
				{/* Input as children */}
				{children}
			</div>
		);
	}
	return (
		<div className='col-span-full w-full flex py-5 px-2  gap-x-5 justify-between border-t-4 mt-5 ' {...props}>
			{/* Input as children */}
			{children}
		</div>
	);
}

/**
 * Automatically generated form footer
 * @param {function} handleReset provide reset callback if you want reset button
 * @param {function} handleDelete provide delete callback if you want delete button
 * @returns
 */
function DefaultFooter({ handleReset = null, handleDelete = null, styled = true }) {
	const { Submit, ConfirmYes, ConfirmNo, Delete, Reset } = useDefaultButtons();
	const [showConfirm, setShowConfirm] = useState(false);
	const { t } = useTranslation('translation');

	//Delete Handling Buttons
	const deleteSectionDefault = <Delete onClick={() => setShowConfirm(() => true)} />;

	const deleteSectionConfirm = (
		<>
			<span className='text-sm font-medium'>{t('buttons.deleteConfirm')}</span>
			<ConfirmNo onClick={() => setShowConfirm(() => false)} />
			<ConfirmYes onClick={handleDelete} />
		</>
	);

	return (
		<Footer styled={styled}>
			<div className='flex-1 flex gap-x-2'>
				{/* Save & Reset Buttons */}
				<Submit icon='FaSave' text='save' />
				{typeof handleReset === 'function' && <Reset onClick={handleReset} />}
			</div>
			{typeof handleDelete === 'function' && (
				<div className='flex flex-wrap gap-x-2 justify-end items-center'>
					{/* Delete Section */}
					{showConfirm === false ? deleteSectionDefault : deleteSectionConfirm}
				</div>
			)}
		</Footer>
	);
}

/**
 * Provide a flex-row wrapper
 */
function FormRow({ children }) {
	return <div className='flex flex-row  gap-x-5'>{children}</div>;
}

function CheckboxLabel({ children, text, textRight = true, ...props }) {
	return (
		<label className='select-none flex items-center gap-x-5 py-2' {...props}>
			{!textRight && <span className='label-text'>{text}</span>}
			<span className='min-w-[40px]'>{children}</span>
			{textRight && <span className='label-text'>{text}</span>}
		</label>
	);
}

//Building Blocks
Form.Grid = Grid;
Form.Section = Section;
Form.Control = Control;
Form.ControlGroup = GroupControl;
Form.Footer = Footer;
Form.DefaultFooter = DefaultFooter;
Form.Row = FormRow;
Form.CheckboxLabel = CheckboxLabel;

//Inputs
Form.Text = InputText;
Form.Number = InputNumber;
Form.Select = InputSelect;
Form.Textarea = InputTextarea;
Form.Date = InputDate;
Form.Checkbox = InputCheckbox;

export default Form;
