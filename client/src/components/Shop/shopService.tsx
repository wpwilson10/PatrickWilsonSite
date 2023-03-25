import axios from "axios";
import { IProductList } from "../Product/productService";

/**
 * The server URL for the product API. This URL is set using the PRODUCT_API environment variable.
 * @type {string}
 */
const baseUrl: string = process.env.PRODUCT_API!;

/**
 * Retrieves all products from the product API.
 *
 * @async
 * @function
 * @returns {Promise<IProductList>} A Promise that resolves to an object containing an array of products.
 */
export const getAll = async (): Promise<IProductList> => {
	const response = await axios.get(baseUrl);
	// do better data validation
	return response.data;
};
