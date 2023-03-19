import axios from "axios";
import { IProduct } from "../Product/productService";

/**
 * The server URL for the checkout API. This URL is set using the CHECKOUT_API environment variable.
 * @type {string}
 */
const baseUrl: string = process.env.CHECKOUT_API!;

/**
 * Interface for the redirect URL returned by the Stripe server after leaving a checkout session
 *
 * @interface checkoutRedirect
 * @property {string} url - The redirect URL
 */
export interface checkoutRedirect {
	url: string;
}

/**
 * Interface for updating product quanities in the shopping cart redux store.
 *
 * @interface productQuantity
 * @property {string} productID - The product's stripe ID
 * @property {number} quantity - The number to change the quantity to
 */
export interface productQuantity {
	productID: string;
	quantity: number;
}

/**
 * Sends the products from the shopping cart to the server checkout API endpoint and returns a redirect URL
 *
 * @async
 * @function
 * @param {IProduct[]} shoppingCart - The products from the shopping cart to be sent to the checkout API
 * @returns {Promise<checkoutRedirect>} - The redirect URL after the checkout process is completed
 */
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
