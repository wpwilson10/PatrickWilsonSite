import axios from "axios";
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
	const response = await axios.post(baseUrl, shoppingCart);
	return response.data;
};

export default postCartCheckout;
