export class ValidationError extends Error {
	constructor(message, fieldName = null, formName = null) {
		super(message); // (1)
		this.name = 'ValidationError'; // (2)
		this.fieldName = fieldName;
		this.formName = formName;
	}
}
