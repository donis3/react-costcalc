import React from 'react';
import './FormInput.css';
/**
 * Wrapper for form items
 */
const FormInput = ({ children, label = null, error = null, altLabel = null, ...props }) => {
	let showErrors = false;
	const itemClass = ['form-control'];

	if (props.className) {
		itemClass.push(props.className);
	}

	if (Array.isArray(error)) {
		const errors = error.filter((err) => (typeof err === 'string' ? err : null));
		if (errors.length > 0) showErrors = true;
	} else if (error && typeof error === 'string' && error.trim().length > 0) {
		showErrors = true;
	}
	if (showErrors) itemClass.push('form-error');

	const mainLabel = (
		<label className='label'>
			<span className='label-text'>{label}</span>
		</label>
	);

	const secondaryLabel = (
		<label className='label text-sm leading-3'>
			<span dangerouslySetInnerHTML={{ __html: altLabel }} />
		</label>
	);

	//Multiple error showing support
	const errorLabel = (
		<label className='label text-sm leading-3'>
			{Array.isArray(error) && error.length > 0 ? (
				<div className='flex flex-col'>
					{error.map((err, i) => (
						<span key={i}>{err}</span>
					))}
				</div>
			) : (
				<span>{error}</span>
			)}
		</label>
	);

	return (
		<div className={itemClass.join(' ')}>
			{label && mainLabel}
			{children}
			{showErrors && errorLabel}
			{altLabel && !showErrors && secondaryLabel}
		</div>
	);
};

/**
 * Generate jsx for form input type = text
 */
const TextInput = (props) => {
	const { defaultValue = null, name, value = '', filter, onChange, reference = null, ...attributes } = props;
	if (attributes?.children) delete attributes.children;
	if (attributes?.type) delete attributes.type;
	if (!name) console.warn('Input field is missing name attribute');

	//Custom onChange handler
	const handleChange = (e) => {
		if (filter && filter === 'number') {
			let filteredValue = e.target.value;

			if (filteredValue.length > 0) {
				filteredValue = filteredValue.replace(',', '.'); //replace comma with dot
				filteredValue = filteredValue.replace(/[^0-9.-]/g, ''); //remove non number chars
				//Remove leading zero
				filteredValue = filteredValue.replace(/^0+/, '');
				if (filteredValue.length === 0) filteredValue = '0';
				filteredValue = filteredValue === '.' ? '0.' : filteredValue; //Replace one dot with 0.
			} else {
				filteredValue = '0';
			}

			e.target.value = filteredValue;
		}
		onChange?.(e);
	};

	const defaultValueCalculated = () => {
		if (filter === 'number' && defaultValue === null) return 0;
		if (defaultValue !== null) return defaultValue;
		return '';
	};

	if (defaultValue === null) {
		return (
			<input
				type='text'
				name={name}
				value={value}
				onChange={handleChange}
				ref={reference}
				{...attributes}
				className={props.className ? props.className : 'input input-bordered w-full'}
			/>
		);
	} else {
		return (
			<input
				type='text'
				name={name}
				defaultValue={defaultValueCalculated()}
				onChange={handleChange}
				ref={reference}
				{...attributes}
				className={props.className ? props.className : 'input input-bordered w-full'}
			/>
		);
	}
};

/**
 * Generate jsx for form input type = number
 */
const NumberInput = ({ step = 1, min = 0, max = null, ...props }) => {
	const { name, value, ...attributes } = props;
	if (attributes?.children) delete attributes.children;
	if (attributes?.type) delete attributes.type;
	if (!name) console.warn('Input(number) field is missing name attribute');

	return (
		<input
			type='number'
			step={step}
			min={min}
			max={max}
			name={name}
			value={value}
			{...attributes}
			className={props.className ? props.className : 'input input-bordered w-full'}
		/>
	);
};

/**
 * Generate jsx for textarea
 */
const TextareaInput = (props) => {
	const { name, value, reference, ...attributes } = props;
	if (attributes?.children) delete attributes.children;
	if (attributes?.type) delete attributes.type;
	if (!name) console.warn('Textarea field is missing name attribute');

	return <textarea ref={reference} className='textarea textarea-bordered' {...attributes} name={name} value={value} />;
};

const InputGroup = ({ children, ...props }) => {
	let groupClass = 'input-group';
	if ('className' in props) {
		groupClass = groupClass + ' ' + props.className;
	}
	return (
		<label className={groupClass} {...props}>
			{children}
		</label>
	);
};

/**
 * Generate jsx for form select
 * Example options: {name, value, disabled}
 */
const SelectInput = ({ options = [], name, value, reference, ...props }) => {
	if (props?.children) delete props.children;
	if (props?.type) delete props.type;

	if (!name) console.warn('Select field is missing name attribute');
	if (!Array.isArray(options)) options = [{ name: 'Invalid Array', value: 'undefined', disabled: false }];

	return (
		<select
			name={name}
			value={value}
			ref={reference}
			{...props}
			className={props.className ? props.className : 'select select-bordered w-full'}
		>
			{options.map((opt, index) => {
				let name = 'Option Name';
				let value = null;
				let disabled = false;
				if (typeof opt === 'object' && Array.isArray(opt) === false) {
					if ('name' in opt === true) name = opt.name;
					if ('value' in opt === true) value = opt.value;
					if ('disabled' in opt === true) disabled = opt.disabled;
				} else if (typeof opt === 'string') {
					name = opt;
					value = opt;
				} else if (Array.isArray(opt) === true) {
					if (opt.length === 1) {
						name = opt[0];
						value = opt[0];
					} else if (opt.length > 1) {
						name = opt[0];
						value = opt[1];
						if (opt.length > 2 && typeof opt[2] === 'boolean') disabled = opt[2];
					}
				}
				if (disabled) {
					return (
						<option value={value} disabled={true} key={index}>
							{name}
						</option>
					);
				} else {
					return (
						<option value={value} key={index}>
							{name}
						</option>
					);
				}
			})}
		</select>
	);
};

//Attach sub items
FormInput.Text = TextInput;
FormInput.Select = SelectInput;
FormInput.Number = NumberInput;
FormInput.Group = InputGroup;
FormInput.Textarea = TextareaInput;
export default FormInput;
