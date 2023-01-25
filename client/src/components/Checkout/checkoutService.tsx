import axios from "axios";
import { object, number } from "yup";

// --- IO
const baseUrl = process.env.CHECKOUT_API!;

// --- Data structure
export interface ICheckoutForm {
	quantity: number;
}

export interface checkoutRedirect {
	url: string;
}

// --- Communications
const postCheckoutForm = async (
	newCheckout: ICheckoutForm
): Promise<checkoutRedirect> => {
	const response = await axios.post(baseUrl, newCheckout);
	return response.data;
};

// --- Input validation
// Yup library provides input validation
export const schema = object({
	quantity: number().required().positive().integer(),
});

export default postCheckoutForm;
