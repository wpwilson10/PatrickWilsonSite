import { object, string } from "yup";

/**
 * The interface for storing information from a contact form.
 *
 * @typedef {Object} IContactForm
 * @property {string} name - The name of the person submitting the contact form.
 * @property {string} email - The email address of the person submitting the contact form.
 * @property {string} phoneNumber - The phone number of the person submitting the contact form.
 * @property {string} message - The message submitted in the contact form.
 * @property {string} recaptcha - The recaptcha token submitted in the contact form.
 */
export interface IContactForm {
	name: string;
	email: string;
	phoneNumber: string;
	message: string;
	recaptcha: string;
}

/**
 * Regular expression for phone number validation
 *
 * @constant {RegExp}
 */
export const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

/**
 * Schema object for contact form input validation using Yup library.
 *
 * @type {Object}
 * @property {function} name - Validates the name input as a required string.
 * @property {function} message - Validates the message input as a required string.
 * @property {function} email - Validates the email input as a required string and must be a valid email format.
 * @property {function} phoneNumber - Validates the phone number input based on the phoneRegExp.
 * @property {function} recaptcha - Validates the recaptcha input as a string.
 */
export const schema = object({
	name: string().required("Name is required"),
	message: string().required("Message is required"),
	email: string()
		.email("Please enter a valid email address")
		.required("Email address is required"),
	phoneNumber: string().matches(phoneRegExp, {
		message: "Please enter a valid phone number",
		excludeEmptyString: true,
	}),
	recaptcha: string(),
});
