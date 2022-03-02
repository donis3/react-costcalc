import Joi from 'joi';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for Joi & i18n implementation in react.
 * @returns
 */
export default function useJoi(defaultOptions = null) {
	//Load joi.json translation file into i18n
	const { t, i18n } = useTranslation('joi');

	//Load localized joi messages from i18n
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
