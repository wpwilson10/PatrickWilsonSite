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
