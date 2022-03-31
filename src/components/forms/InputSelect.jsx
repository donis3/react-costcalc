import React, { forwardRef } from 'react';

const SelectComponent = forwardRef(InputSelect);

function InputSelect(
	{ setError, getError, name, validator, isSubmitted, liveErrors, onChange, children, options, ...props },
	ref
) {
	if (!name) throw new Error('Input Text requires a name attribute!');
	const selectProps = {};
	const selectOptions = [];

	//Convert provided options to array of {name, value,disabled} objects
	if (Array.isArray(options) && options.length > 0) {
		options.forEach((item) => {
			if (typeof item === 'number' || typeof item === 'string') {
				selectOptions.push({ name: item, value: item });
			} else if (typeof item === 'object' && Object.keys(item).length > 1) {
				const [name, value] = Object.values(item);
				const optionItem = { name, value };
				if ('disabled' in item && typeof item.disabled === 'boolean') {
					optionItem.disabled = item.disabled;
				}
				//dont use selected html attribute. use defaultValue
				if ('selected' in item && typeof item.selected === 'boolean') {
					selectProps.defaultValue = optionItem.value;
				}
				selectOptions.push(optionItem);
			}
		});
	}

	//Controlled / Uncontrolled select
	if ('value' in props === true) {
		delete props.defaultValue;
		delete selectProps.defaultValue;
	}

	
	const hasError = () => {
		const error = getError?.();
		if (typeof error === 'string' && error.length > 0) return true;
		return false;
	};

	//On change handler
	const handleChange = (e) => {
		//If a field has errors already, validate until it is valid.
		if (liveErrors || hasError()) validate(e);
		//Run actual onChange call if provided
		onChange?.(e);
	};

	const validate = (e) => {
		
		//Validate if provided
		if (typeof validator !== 'object' || 'validate' in validator === false) return;
		const { error } = validator.validate(e.target.value);
		if (error) {
			setError(error.message);
		} else {
			setError('');
		}
	};

	//Render
	return (
		<select className='select select-bordered' onChange={handleChange} {...selectProps} {...props} ref={ref}>
			{/* Select Options */}
			{children}
			{selectOptions.length > 0 &&
				selectOptions.map((item, i) => {
					const { name, value, ...props } = item;
					return (
						<option key={i} value={item.value} {...props}>
							{item.name}
						</option>
					);
				})}
		</select>
	);
}

SelectComponent.defaultProps = {
	setError: () => {},
	getError: null,
	name: undefined,
	validator: (value) => ({ value: value, error: undefined }),
	isSubmitted: false,
	liveErrors: false,
	onChange: undefined,
	options: null,
};

export default SelectComponent;
