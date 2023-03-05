/**
 * Represents a product object from the server based on the Stripe API.
 *
 * @see {@link https://stripe.com/docs/api/products/object|Stripe API documentation}.
 *
 * @interface IProduct
 * @property {string} stripeProductID - The unique identifier for the product.
 * @property {string} name - The name of the product.
 * @property {string} description - A description of the product.
 * @property {string[]} images - An array of image URLs for the product.
 * @property {string} stripePriceID - The unique identifier for the price associated with the product.
 * @property {number} unitAmount - The the price associated with the a single unit of the product.
 * @property {string} currency - The currency of the product.
 * @property {number} quantity - The number of units of the product selected.
 */
export interface IProduct {
	stripeProductID: string;
	name: string;
	description: string;
	images: string[];
	stripePriceID: string;
	unitAmount: number;
	currency: string;
	quantity: number;
}

/**
 * Interface for a list of IProducts
 *
 * @interface IProductList
 * @property {Array<IProduct>} products - an array of product objects
 */
export interface IProductList {
	products: IProduct[];
}

/**
 * Returns a formatted price string.
 *
 * @param {number} amount - The amount of the product.
 * @param {string} currency - The currency of the product.
 * @param {number} quantity - The quantity of the product.
 * @returns {string} - The formatted price of the product.
 *
 * @example
 * // returns "$20.00"
 * formatPrice(10, "USD", 2);
 *
 * @see {@link https://github.com/stripe-samples/checkout-one-time-payments|Checkout One-Time Payments Sample Code}
 */
export const formatPrice = (
	amount: number,
	currency: string,
	quantity: number
): string => {
	const numberFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	});
	const parts = numberFormat.formatToParts(amount);
	let zeroDecimalCurrency = true;
	for (let part of parts) {
		if (part.type === "decimal") {
			zeroDecimalCurrency = false;
		}
	}
	amount = zeroDecimalCurrency ? amount : amount / 100;
	const total = (quantity * amount).toFixed(2);
	return total;
};
