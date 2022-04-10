import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import 'react-day-picker/dist/style.css';

import FocusTrap from 'focus-trap-react';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';
import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa';
import useDateFns from '../../hooks/common/useDateFns';
import { useTranslation } from 'react-i18next';
import { isEqual, parseISO } from 'date-fns';

const DatePickerComponent = forwardRef(DatePicker);

function DatePicker({ name, onChange, setValue, ...props }, fwRef) {
	const { t } = useTranslation('translation');
	const { format, isValid, parse, datePickerFormat, locale } = useDateFns();
	const initialDate = strToDate(props.value) || null;
	//Selected Date state
	const [selected, setSelected] = useState(initialDate);

	const dateInput = useRef(null);
	useImperativeHandle(fwRef, () => dateInput.current);

	//Popper state
	const [isPopperOpen, setIsPopperOpen] = useState(false);
	const popperRef = useRef(null);
	const buttonRef = useRef(null);
	const [popperElement, setPopperElement] = useState(null);

	const popper = usePopper(popperRef.current, popperElement, {
		placement: 'top-start',
	});

	const closePopper = () => {
		setIsPopperOpen(false);
		buttonRef?.current?.focus();
	};

	useEffect(() => {
		//If a date iso string is passed, format it
		const newValue = props?.value || props?.defaultValue || dateInput.current?.value;
		if (newValue && isValid(parseISO(newValue))) {
			setValue(format(parseISO(newValue), datePickerFormat));
			setSelected(parseISO(newValue));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props?.value, props?.defaultValue]);

	//On change middleware
	const handleInputChange = (e) => {
		//Check if new value is a valid date,
		//If it is, set it as selected dat
		const date = strToDate(e.target.value);
		if (isValid(date)) {
			//Set selected date for datepicker
			setSelected(date);
		}
		//Run onChange handlers passed through props if available
		onChange?.(e);
	};

	const handleButtonClick = () => {
		setIsPopperOpen(true);
	};

	/**
	 * Runs when a day is clicked on in the calendar
	 * @param {*} date selected date obj
	 */
	const handleDaySelect = (date) => {
		if (date) {
			setSelected(date);
			closePopper();
			//Format the date and send it to input
			setValue(format(date, datePickerFormat));
		} else {
			setSelected(null);
			setValue('');
		}
	};

	//===============// Helpers //=====================//
	function strToDate(value = null) {
		if (!value) return '';
		let date = '';

		//Parse Date value
		try {
			if (isValid(value)) {
				date = value;
			} else if (isValid(new Date(value))) {
				date = new Date(value);
			} else if (isValid(parse(value, datePickerFormat, new Date()))) {
				date = parse(value, datePickerFormat, new Date());
			} else if (isValid(parseISO(value))) {
				date = parseISO(value);
			}
		} catch (error) {}

		return date;
	}

	//===============// Render //=====================//
	return (
		<>
			<div className='input-group w-full' ref={popperRef}>
				<input
					type='text'
					name={name}
					ref={dateInput}
					className='input input-bordered flex-1'
					placeholder={format(new Date(), datePickerFormat)}
					value={props.value}
					onChange={handleInputChange}
				/>

				<button
					type='button'
					className='btn btn-primary'
					ref={buttonRef}
					aria-label={t('dates.pickDate')}
					onClick={handleButtonClick}
				>
					<CalendarIcon className='text-lg' />
				</button>
				{/* <span>current date: {isValid(selected) && format(selected, datePickerFormat)}</span> */}
			</div>

			{isPopperOpen && (
				<FocusTrap
					active
					focusTrapOptions={{
						initialFocus: false,
						allowOutsideClick: true,
						clickOutsideDeactivates: true,
						onDeactivate: closePopper,
					}}
				>
					<div
						tabIndex={-1}
						style={popper.styles.popper}
						className='bg-base-100 border rounded-md shadow-md'
						{...popper.attributes.popper}
						ref={setPopperElement}
						role='dialog'
					>
						<DayPicker
							initialFocus={isPopperOpen}
							mode='single'
							defaultMonth={selected}
							selected={selected}
							onSelect={handleDaySelect}
							locale={locale}
						/>
					</div>
				</FocusTrap>
			)}
		</>
	);
}

DatePickerComponent.defaultProps = {
	name: undefined,
	value: undefined,
	defaultValue: undefined,
	onChange: (e) => {},
};

export default DatePickerComponent;
