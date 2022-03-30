import React, { forwardRef } from 'react';
/*
This field is for using with formBuilder.
Example usage:

<Form.Control label='last name' altLabel='your last name' error={getError('lastname')}>
	<Form.Text {...register({ field: 'lastname', isControlled: false })} liveErrors />
</Form.Control>
*/

const InputTextComponent = forwardRef(InputText);

function InputText({ setError, getError, name, validator, isSubmitted, liveErrors, onChange, ...props }, ref) {
	if (!name) throw new Error('Input Text requires a name attribute!');

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

	return (
		<input
			type='text'
			key={name}
			onChange={handleChange}
			className='input input-bordered'
			{...props}
			ref={ref}
		/>
	);
}

InputTextComponent.defaultProps = {
	setError: () => {},
	getError: null,
	name: undefined,
	validator: (value) => ({ value: value, error: undefined }),
	isSubmitted: false,
	liveErrors: false,
	onChange: undefined,
};

export default InputTextComponent;
