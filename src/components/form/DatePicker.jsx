import React, { forwardRef, useRef, useState } from 'react';
import 'react-day-picker/dist/style.css';

import FocusTrap from 'focus-trap-react';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';
import { FaCalendarAlt as CalendarIcon } from 'react-icons/fa';
import useDateFns from '../../hooks/common/useDateFns';
import { useTranslation } from 'react-i18next';

const DatePickerComponent = forwardRef(DatePicker);



function DatePicker({ name, onChange, ...props }, ref) {
	const { t } = useTranslation('translation');
	const { format, isValid, parse, datePickerFormat } = useDateFns();
	//initial Date State
	let initialState = props?.value ? props.value : '';
	try {
		const loadedDate = new Date(initialState);
		initialState = format(loadedDate, datePickerFormat);
	} catch (error) {}

	//Date state
	const [selected, setSelected] = useState();
	const [inputValue, setInputValue] = useState(initialState);

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
	const handleInputChange = (value) => {
		setInputValue(value);
		const date = parse(value, datePickerFormat, new Date());
		if (isValid(date)) {
			setSelected(date);
		} else {
			setSelected(undefined);
		}

		//Send timestamp as onChange event value
		const event = {
			target: {
				name: name,
				value: value,
			},
		};
		onChange?.(event);
	};

	const handleButtonClick = () => {
		setIsPopperOpen(true);
	};

	const handleDaySelect = (date) => {
		setSelected(date);
		if (date) {
			setInputValue(format(date, datePickerFormat));
			handleInputChange(format(date, datePickerFormat));
			closePopper();
		} else {
			setInputValue('');
			handleInputChange('');
		}
	};

	return (
		<>
			<div className='input-group w-full' ref={popperRef}>
				<input
					type='text'
					name={name}
					ref={ref}
					className='input input-bordered flex-1'
					placeholder={format(new Date(), datePickerFormat)}
					value={inputValue}
					onChange={(e) => handleInputChange(e.target.value)}
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
