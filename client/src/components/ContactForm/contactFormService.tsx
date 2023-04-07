import axios from "axios";
import { object, string } from "yup";

/**
 * The server URL for the contact form API. This URL is set using the CONTACT_FORM_API environment variable.
 * @type {string}
 */
const baseUrl: string = process.env.CONTACT_FORM_API!;

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
 * postContactForm is an asynchronous function that sends a POST request to the specified URL with the data from a contact form.
 *
 * @async
 * @function
 * @param {IContactForm} newContact - The contact form data object containing a name, email, phone number, message, and recaptcha token.
 * @returns {Promise<IContactForm>} Returns a Promise that resolves to an IContactForm object representing the response data from the server.
 */
const postContactForm = async (
	newContact: IContactForm
): Promise<IContactForm> => {
	const response = await axios.post(baseUrl, newContact);

	return response.data;
};

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

export default postContactForm;
