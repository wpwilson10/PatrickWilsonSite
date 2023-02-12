import axios from "axios";
import { object, number } from "yup";
import { IProduct } from "../Product/productService";

// --- IO
const baseUrl = process.env.CHECKOUT_API!;

export interface ICartProduct extends IProduct {
	quantity: number;
}

export interface checkoutRedirect {
	url: string;
}

// --- Communications
const postCartCheckout = async (
	shoppingCart: ICartProduct[]
): Promise<checkoutRedirect> => {
	console.log(shoppingCart);
	const response = await axios.post(baseUrl, shoppingCart);
	return response.data;
};

// --- Input validation
// Yup library provides input validation
export const schema = object({
	quantity: number().required().positive().integer(),
});

export default postCartCheckout;
