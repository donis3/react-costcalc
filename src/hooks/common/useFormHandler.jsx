import { useEffect, useState } from 'react';

const useFormHandler = ({ formState = null, setFormState = null, schema = null }) => {
	const [errors, setErrors] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [defaultState, setDefaultState] = useState({});

	//On initial mount, save default state
	useEffect(() => {
		if (formState && Object.keys(formState).length > 0) {
			setDefaultState((state) => ({ ...formState }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const resetForm = () => {
		if (!setFormState) return;
		if (defaultState && typeof defaultState === 'object') setFormState((state) => ({ ...defaultState }));
		setIsSubmitted(() => false);
	};

	useEffect(() => {
		if (errors.length > 0) {
			validateForm(formState);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState]);

	/**
	 * Validate a form using schema and return clean data if it passes
	 * If there are errors, errors state will be updated
	 * @param {*} formData
	 * @returns
	 */
	const validateForm = (formData) => {
		if (!schema) return null;

		const result = schema.validate(formData);
		

		//There are errors
		if (result.error && result.error.details) {
			const newErrorState = [];
			//Loop through errors
			result.error.details.forEach((err) => {
				const key = err?.context?.key;
				const message = err?.message;
				if (!key) return;
				//Push the new error to the array
				newErrorState.push({ key, message });
			});
			//Refresh state
			setErrors(newErrorState);
			return null;
		} else {
			//no errors, remove error state
			setErrors([]);
		}
		//Return clean validated form data
		return result?.value;
	};

	/**
	 * If form has no errors, will pass formdata to callback
	 * @param {*} e submit event object
	 * @param {*} customHandler form submit callback
	 */
	const onSubmitHandler = (e, customHandler) => {
		e.preventDefault();
		setIsSubmitted(true);

		const data = validateForm(formState);
		
		if (!data) {
			//There are errors do not submit
			// console.log('Form has errors');
			// console.table(errors);
			return [...errors];
		} else {
			//there are no errors and we received a clean data object. Pass it down to form caller
			customHandler(data);
		}
	};

	/**
	 * Change a form state quickly
	 * @param {*} name field name
	 * @param {*} value value
	 */
	const setFieldState = (name, value) => {
		setFormState((currentState) => {
			if (name in currentState === false) {
				return currentState;
			}
			const newState = { ...currentState, [name]: value };
			return newState;
		});
	};

	/**
	 * Bind a form field with this to auto validate on change and set form state
	 * @param {*} e onChange event
	 */
	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		if (!name) {
			console.log(`FormHandler Error: field name is empty`);
			return;
		}
		if (formState && name in formState === false) {
			//This field does not exist in state.
			console.log(`FormHandler Error: Form State doesn't have a field named [${name}]`);
			return;
		}

		//Set state
		setFormState((currentState) => {
			return {
				...currentState,
				[name]: value,
			};
		});
	};

	/**
	 * If a form field has errors, return it or return false
	 * @param {string} fieldName form field name
	 * @returns {boolean, string} message for the field or false
	 */
	const hasError = (fieldName) => {
		const result = errors.find((err) => err.key === fieldName);

		//hide before submit if field is empty
		if (formState && isSubmitted === false && fieldName in formState && !formState[fieldName]) {
			//Form field is yet empty and form is not yet submitted. remove error
			return false;
		}

		return result ? result.message : false;
	};

	//exports
	return { onChangeHandler, setFieldState, onSubmitHandler, errors, hasError, resetForm };
};

export default useFormHandler;
