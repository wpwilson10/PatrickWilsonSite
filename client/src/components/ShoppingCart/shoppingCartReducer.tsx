import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { formatPrice, IProduct, IProductList } from "../Product/productService";

/**
 * Represents the shopping cart state in Redux.
 *
 * @typedef {Object} ShoppingCartState
 * @property {IProduct[]} cart - The array of products in the shopping cart.
 * @property {number} totalAmount - The sum total price of products in the shopping cart.
 * @property {number} totalQuantity - The total quantity of products in the shopping cart.
 * @property {boolean} isOpen - True is the shopping cort sidebar is open, false otherwise.
 *
 * Typescript + Redux wants an explicit state type and initialization for correct type inferrence
 *  https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
 */
type ShoppingCartState = {
	cart: IProduct[];
	totalAmount: number;
	totalQuantity: number;
	isOpen: boolean;
};

/**
 * Initial state for the shopping cart slice.
 *
 * @type {ShoppingCartState}
 */
const initialState: ShoppingCartState = {
	cart: [],
	totalAmount: 0,
	totalQuantity: 0,
	isOpen: false,
};

/**
 * Interface for updating products values in the shopping cart redux store. Uses just the product
 * and not the whole product to force lookup on the current product in the store as opposed to
 * some nebulous product object.
 *
 * @interface cartProduct
 * @property {string} productID - The product's stripe ID
 */
export interface cartProduct {
	productID: string;
}

/**
 * A Redux slice for managing the shopping cart state
 *
 * @typedef {Object} ShoppingCartSlice
 * @property {string} name - The slice name, "shoppingCart"
 * @property {ShoppingCartState} initialState - The initial empty state of the shopping cart slice
 * @property {Object} reducers - An object containing the reducer functions for updating the shopping cart state
 * @property {Function} reducers.setCart - A reducer function that sets the entire shopping cart state
 * @property {Function} reducers.setIsOpen - A reducer function that sets the shopping cart sidebar to open or close
 * @property {Function} reducers.addToCart - A reducer function that adds a product to the shopping cart or increases the quantity if the product is already in the cart
 * @property {Function} reducers.removeItem - A reducer function that removes a product from the shopping cart
 * @property {Function} reducers.incrementQuantity - A reducer function that decrements the quantity for a given product
 * @property {Function} reducers.incrementQuantity - A reducer function that increments the quantity for a given product
 */
const shoppingCartSlice = createSlice({
	name: "shoppingCart",
	initialState: initialState,
	reducers: {
		setCart: (state, action: PayloadAction<IProductList>) => {
			state.cart = action.payload.products;
		},
		setIsOpen: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
		addToCart: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);

			if (productInCart) {
				productInCart.quantity++;
				// running totals
				recalculateTotal(state);
			} else {
				// shouldn't happend
				console.log("Tried to add product that doesn't exist");
			}
		},
		removeItem: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);
			// products get filtered out of cart when quantity = 0
			if (productInCart) {
				productInCart.quantity = 0;
				// running totals
				recalculateTotal(state);
			}
		},
		decrementQuantity: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);

			if (productInCart) {
				// update quantity if there is more than one
				if (productInCart.quantity > 1) {
					productInCart.quantity--;
					// running totals
					recalculateTotal(state);
				}
			}
		},
		incrementQuantity: (state, action: PayloadAction<cartProduct>) => {
			let productInCart = findInCart(state, action.payload.productID);

			if (productInCart) {
				// update quantity
				productInCart.quantity++;
				// running totals
				recalculateTotal(state);
			}
		},
	},
});

/**
 * Finds the product from the shopping cart Redux state with a given product ID.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 * @param {RootState} productID - The string ID of the product to look up.
 * @returns {IProduct} The product object from the shopping cart state.
 */
const findInCart = (state: ShoppingCartState, productID: string) => {
	return state.cart.find((item) => item.stripeProductID === productID);
};

/**
 * Recalculates the total quantity and prices of all products in the cart.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 */
const recalculateTotal = (state: ShoppingCartState) => {
	let runningTotal = 0;
	let runningQuanity = 0;

	state.cart.forEach((item: IProduct) => {
		runningQuanity += item.quantity;
		runningTotal += item.quantity * item.unitAmount;
	});

	state.totalAmount = runningTotal;
	state.totalQuantity = runningQuanity;
};

/**
 * Selects the cart product array from the shopping cart Redux state.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 * @returns {IProduct[]} The shopping cart array of products from the shopping cart state.
 */
export const selectCartProducts = (state: RootState) => {
	return state.shoppingCart.cart;
};

/**
 * Returns the total quantity of items in the shopping cart.
 *
 * @function
 * @param {RootState} state - The current state of the Redux store.
 * @returns {number} - The total quantity of items in the shopping cart.
 */
export const selectCartTotalQuantity = (state: RootState) => {
	return state.shoppingCart.totalQuantity;
};

/**
 * Returns the total price amount of all items in the cart as a formatted string.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {string} The total price amount of all items in the cart as a formatted string.
 */
export const selectCartTotalAmount = (state: RootState) => {
	return formatPrice(state.shoppingCart.totalAmount, "USD", 1);
};

/**
 * Returns the status of the shopping cart sidebar.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @returns {boolean} The status of the shopping cart sidebar.
 */
export const selectIsOpen = (state: RootState) => {
	return state.shoppingCart.isOpen;
};

/**
 * Returns a given product from the shopping cart.
 *
 * @function
 * @param {RootState} state - The Redux store root state.
 * @param {string} productID - The stripe product ID for the target product
 * @returns {IProduct} The product in the shopping cart matching the given product ID
 */
export const selectProduct = (state: RootState, productID: string) => {
	const selectedProduct = state.shoppingCart.filter(
		(item: IProduct) => item.stripeProductID !== productID
	);

	return selectedProduct;
};

/**
 * This statement exports the reducer function as the default export of the module,
 * so it can be imported by other parts of the codebase. In this specific case,
 * it is used by the Redux store to manage the state of the shopping cart.
 */
export default shoppingCartSlice.reducer;
/**
    Destructures the actions object from the shoppingCartSlice slice and
    assigns the addToCart, removeItem, and setCart action creators to
    constants. These constants can be used to dispatch these actions from
    components or other parts of the Redux store.
    */
export const {
	addToCart,
	removeItem,
	setCart,
	setIsOpen,
	incrementQuantity,
	decrementQuantity,
} = shoppingCartSlice.actions;
