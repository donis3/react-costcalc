import { useRef, useState } from 'react';
import useJoi from '../common/useJoi';

export default function useFormBuilder({ initialState = {}, isSubmitted = false } = {}) {
	//=========================// Dependencies //=========================//
	const joi = useJoi({ abortEarly: false, convert: true });
	const schema = {};
	const [formErrors, setFormErrors] = useState({});
	const [formState, setFormState] = useState(initialState);
	const inputRefs = useRef({});
	const onChangeMiddleware = {};

	//=========================// Private Methods //=========================//

	//Register controlled input component
	function registerControlledInput(field) {
		return {
			name: field,
			validator: schema[field],
			getError: () => formErrors?.[field],
			setError: (message = null) => setFormError(field, message),
			isSubmitted: isSubmitted,
			key: field,
			value: field in formState ? formState[field] : '',
			onChange: (e) => onControlledInputChange(field, e.target.value),
		};
	}

	//Register normal input component
	function registerReferencedInput(field) {
		return {
			name: field,
			validator: schema[field],
			getError: () => formErrors?.[field],
			setError: (message = null) => setFormError(field, message),
			isSubmitted: isSubmitted,
			key: field,
			defaultValue: field in initialState ? initialState[field] : '',
			onChange: (e) => normalInputChange(field, e.target.value),
			ref: (element) => (inputRefs.current[field] = element),
		};
	}

	//ON change middleware for controlled inputs
	function onControlledInputChange(field, value) {
		if (field in onChangeMiddleware && typeof onChangeMiddleware[field] === 'function') {
			onChangeMiddleware[field](value);
		}
		return setFormState((state) => ({ ...state, [field]: value }));
	}

	//On change middleware for referenced inputs
	function normalInputChange(field, value) {
		if (field in onChangeMiddleware && typeof onChangeMiddleware[field] === 'function') {
			onChangeMiddleware[field](value);
		}
	}

	//Set error for field
	const setFormError = (field = null, message = null) => {
		if (typeof field !== 'string' || field.length === 0) return;
		if (typeof message === 'string' && message.length > 0) {
			setFormErrors((state) => ({ ...state, [field]: message }));
		} else {
			setFormErrors((state) => ({ ...state, [field]: '' }));
		}
	};

	//Will run joi schema validation and set errors in formErrors state
	function validateForm(formData) {
		//Create joi schema
		const joiSchema = joi.object(schema);
		const { value, error } = joiSchema.validate(formData);

		//We have errors, set them
		if (error && Array.isArray(error.details) && error.details.length > 0) {
			setFormErrors((state) => {
				return error.details.reduce((accumulator, current) => {
					let msg = current.message;
					let field = current.context.key;
					return { ...accumulator, [field]: msg };
				}, {});
			});
		} else {
			setFormErrors({});
		}
		return { value, error };
	}

	//=========================// Public Methods //=========================//

	/**
	 * Registers an input for formBuilder.
	 * Each Input/select etc must be registered.
	 * Example
	 * <Form.Text {...register({ field: 'name', isControlled: false })} />
	 *
	 * @param {string} field fieldName
	 * @param {bool} isControlled controlled or not. Will use react state for controlled ones
	 * @returns
	 */
	function register({ field = null, isControlled = false }) {
		return isControlled ? registerControlledInput(field) : registerReferencedInput(field);
	}

	/**
	 * A middleware for onChange events.
	 * Callback will be run with the value of the field when a change occurs.
	 * @param {*} field field name
	 * @param {*} callback fn
	 */
	function registerOnChangeMiddleware(field, callback) {
		onChangeMiddleware[field] = callback;
	}

	/**
	 * Will validate the form and return clean data using schema
	 * Will also include initialState values and merge with formData
	 * @param {bool} includeInitialState if false, will only return values for joi schema
	 * @returns
	 */
	const getFormData = (includeInitialState = false) => {
		let result = { ...formState };
		//Add uncontrolled input values
		Object.keys(inputRefs.current).forEach((key) => {
			result[key] = key in inputRefs.current ? inputRefs.current[key].value : '';
		});
		//Create joi schema
		const { value, error } = validateForm(result);

		return value;
	};

	/**
	 * Get current value from the field
	 * @param {*} field field name
	 * @returns
	 */
	const getValue = (field = null) => {
		if (!field) return;
		let result = null;

		if (Object.keys(inputRefs.current).find((key) => key === field)) {
			//Given field is available in uncontrolled units list. Get value from there
			Object.keys(inputRefs.current).forEach((key) => {
				if (key !== field) return;
				//Found the requested field
				result = key in inputRefs.current ? inputRefs.current[key].value : null;
			});
		} else {
			//Check if given field is in formState and return it
			if (field in formState) {
				result = formState[field];
			}
		}
		return result;
	};

	/**
	 * Set value for given field manually.
	 * @param {*} field field name
	 * @param {*} value new value
	 * @returns
	 */
	const setValue = (field = null, value = null) => {
		if (!field) return;
		if (typeof value !== 'string' && typeof value !== 'number') value = '';

		if (Object.keys(inputRefs.current).find((key) => key === field)) {
			//Given field is available in uncontrolled units list.
			Object.keys(inputRefs.current).forEach((key) => {
				if (key !== field) return;
				//Found the requested field
				inputRefs.current[key].value = value;
			});
		} else {
			//Check if given field is in formState and return it
			setFormState((state) => ({ ...state, [field]: value }));
		}
	};

	/**
	 * Get a field from formState
	 * @param {*} field fieldName
	 * @param {*} value value
	 */
	const getState = (field) => {
		if (typeof field !== 'string' || field.length === 0) return;
		if (field in formState === false) return;
		return formState[field];
	};
	/**
	 * Manually set a value to formState obj
	 * @param {*} field fieldName
	 * @param {*} value value
	 */
	const setState = (field, value) => {
		if (typeof field !== 'string' || field.length === 0) return;
		setFormState((state) => ({ ...state, [field]: value }));
	};
	/**
	 * Manually remove a field from formState
	 * @param {*} field fieldName
	 */
	const removeState = (field) => {
		if (typeof field !== 'string' || field.length === 0) return;
		if (field in formState === false) return;
		setFormState((state) => {
			delete state[field];
			return state;
		});
	};

	//=========================// Exports //=========================//
	return {
		joi,
		schema,
		register,
		getError: (field) => formErrors?.[field],
		handleChange: registerOnChangeMiddleware,
		getFormData,
		formErrors,
		hasError: () => (Object.keys(formErrors).length > 0 ? true : false),
		//Values (including referenced inputs)
		setValue,
		getValue,
		//State crud
		getState,
		setState,
		removeState,
	};
}
