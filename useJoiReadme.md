# Joi and React with Localization

#### _by Deniz_

We will be using Joi on the frontend with react and i18next-react modules. This way, we will be able to use translation with Joi messages with ease.
I will be providing the english translation file aswell with complete key-value pair (hopefully.)

### useJoi custom hook

We want a custom hook to get the customized Joi instance from whenever we need it. We can build our schemas on that instance later on.
We need to be able to pass default options aswell if need be.
The important part is, we need the whole object from our i18next translation file thus we pass the option returnObjects: true when we call the translation function.

###### useJoi.jsx

```js
import Joi from 'joi';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for Joi & i18n implementation in react.
 * @returns Joi instance
 */
export default function useJoi(defaultOptions = null) {
	//Load joi.json translation file into i18n
	const { t, i18n } = useTranslation('joi');

	//Load localized joi messages from i18n as object
	const messages = t('messages', { returnObjects: true });

	//Initialize joi using loaded messages and passed in options
	const joiInstance = initializeJoi(messages, i18n.language, defaultOptions);

	return joiInstance;
}

/**
 * Create a joi instance with custom messages and options
 * @param {*} messages 1 level object of joi error messages.
 * @param {*} options default schema options object
 * @returns {object} Joi instance
 */
const initializeJoi = (messages = null, language = null, options = {}) => {
	let schemaOptions = {};

	//If available, load localized messages
	if (language && messages && typeof messages === 'object') {
		schemaOptions = {
			messages: messages, //Load translations here
			errors: { language: language }, //Set current language
		};
	}

	//Add default options
	if (options && typeof options === 'object' && Object.keys(options).length > 0) {
		schemaOptions = {
			...schemaOptions,
			...options,
		};
	}

	//Return new joi instance
	return Joi.defaults((schema) => {
		return schema.options(schemaOptions);
	});
};
```

### Creating Schemas

Now that we have a joi instance, we can create custom hooks for our schema objects
Lets create a user schema

###### useUserSchema.jsx

```js
import useJoi from './useJoi';
import { useTranslation } from 'react-i18next';

export default function useUserSchema() {
	//We can get localized form labels
	const { t } = useTranslation('forms/user');
	//Lets get a joi instance with the options provided
	const Joi = useJoi({ abortEarly: false, convert: true });

	//create a user schema using our custom joi instance
	const schema = Joi.object({
		username: Joi.string().min(5).required().label(t('form.username')),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required().label(t('form.password')),
	});

	return schema;
}
```

### Usage

Now that we have everything we need, we can just call our desired schema in our form components and start validating

```js
// ... inside react component
//Load the schema
const userSchema = useUserSchema();

//Test it
const testResult = userSchema.validate({ username: 'hi', password: 'securepassword123' });
console.log(testResult?.error.details); //username must be at least 5 characters long
```

### i18n translation files

This is how things look like in the public/locales/en/joi.json file. Full file will be included below

```json
{
	"messages": {
		"any.custom": "{{#label}} failed custom validation because {{#error.message}}",
		"date.base": "{{#label}} must be a valid date",
		"number.base": "{{#label}} must be a number",
		"number.max": "{{#label}} must be less than or equal to {{#limit}}",
		"number.min": "{{#label}} must be greater than or equal to {{#limit}}",
		"string.base": "{{#label}} must be a string",
		"string.length": "{{#label}} length must be {{#limit}} characters long",
        ...
	}
}
```
