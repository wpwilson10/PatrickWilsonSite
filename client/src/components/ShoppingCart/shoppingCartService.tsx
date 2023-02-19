import axios from "axios";
import { IProduct } from "../Product/productService";

// --- IO
const baseUrl = process.env.CHECKOUT_API!;

export interface checkoutRedirect {
	url: string;
}

// --- Communications
const postCartCheckout = async (
	shoppingCart: IProduct[]
): Promise<checkoutRedirect> => {
	// filter out products with quantity zero
	const nonZeroProducts = shoppingCart.filter((value) => value.quantity > 0);
	// send to server
	const response = await axios.post(baseUrl, nonZeroProducts);
	return response.data;
};

export default postCartCheckout;
