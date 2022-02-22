import React from 'react';

/**
 * Wrapper for form items
 */
const FormInput = ({ children, label = null, error = null, altLabel = null, ...props }) => {
	const itemClass = ['form-control'];
	if (props.className) {
		itemClass.push(props.className);
	}
	if (error) itemClass.push('form-error');

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

	const thirdLabel = (
		<label className='label text-sm leading-3 text-error-content'>
			<span>{error}</span>
		</label>
	);

	return (
		<div className={itemClass.join(' ')}>
			{label && mainLabel}
			{children}
			{error && thirdLabel}
			{altLabel && !error && secondaryLabel}
		</div>
	);
};

/**
 * Generate jsx for form input type = text
 */
const TextInput = (props) => {
	const { name, value, ...attributes } = props;
	if (attributes?.children) delete attributes.children;
	if (attributes?.type) delete attributes.type;
	if (!name) console.warn('Input field is missing name attribute');

	return (
		<input
			type='text'
			name={name}
			value={value}
			{...attributes}
			className={props.className ? props.className : 'input input-bordered w-full max-w-lg'}
		/>
	);
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
			className={props.className ? props.className : 'input input-bordered w-full max-w-lg'}
		/>
	);
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
 */
const SelectInput = ({ options = [], name, value, ...props }) => {
	if (props?.children) delete props.children;
	if (props?.type) delete props.type;

	if (!name) console.warn('Select field is missing name attribute');
	if (!Array.isArray(options)) options = [{ name: 'Invalid Array', value: 'undefined', disabled: false }];

	return (
		<select
			name={name}
			value={value}
			{...props}
			className={props.className ? props.className : 'select select-bordered w-full max-w-lg'}
		>
			{options.map((opt) => {
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
						<option value={value} disabled={true}>
							{name}
						</option>
					);
				} else {
					return <option value={value}>{name}</option>;
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
export default FormInput;
