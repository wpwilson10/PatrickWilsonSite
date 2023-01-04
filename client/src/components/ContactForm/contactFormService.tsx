import axios from "axios";
import { object, string } from "yup";

// --- IO
const baseUrl = "http://localhost:3030/contactForm";

// --- Data structure
export interface IContactForm {
	name: string;
	email: string;
	phoneNumber: string;
	message: string;
	recaptcha: string;
}

// --- Communications
const postContactForm = async (
	newContact: IContactForm
): Promise<IContactForm> => {
	const response = await axios.post(baseUrl, newContact);

	return response.data;
};

// --- Input validation
// Yup library provides input validation
export const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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
