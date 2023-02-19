import axios from "axios";
import { IProductList } from "../Product/productService";

// --- IO
const baseUrl = process.env.PRODUCT_API!;

export const getAll = async (): Promise<IProductList> => {
	const response = await axios.get(baseUrl);
	// do better data validation
	return response.data;
};
