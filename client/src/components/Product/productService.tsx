// --- Data structure
// - why did I have to build this. Seems like it should exist in some library
// - https://stripe.com/docs/api/products/object
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

export interface IProductList {
	products: IProduct[];
}

// Copied and modified from https://github.com/stripe-samples/checkout-one-time-payments
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
