import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { formatPrice, IProduct } from "../Product/productService";

/**
 * Represents the shopping cart state in Redux.
 *
 * @typedef {Object} ShoppingCartState
 * @property {IProduct[]} cart - The array of products in the shopping cart.
 * @property {number} totalAmount - The sum total price of products in the shopping cart.
 * @property {number} totalQuantity - The total quantity of products in the shopping cart.
 *
 * Typescript + Redux wants an explicit state type and initialization for correct type inferrence
 *  https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
 */
type ShoppingCartState = {
	cart: IProduct[];
	totalAmount: number;
	totalQuantity: number;
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
};

/**
 * A Redux slice for managing the shopping cart state
 *
 * @typedef {Object} ShoppingCartSlice
 * @property {string} name - The slice name, "shoppingCart"
 * @property {ShoppingCartState} initialState - The initial empty state of the shopping cart slice
 * @property {Object} reducers - An object containing the reducer functions for updating the shopping cart state
 * @property {Function} reducers.addToCart - A reducer function that adds a product to the shopping cart or increases the quantity if the product is already in the cart
 * @property {Function} reducers.removeItem - A reducer function that removes a product from the shopping cart
 * @property {Function} reducers.setCart - A reducer function that sets the entire shopping cart state
 */
const shoppingCartSlice = createSlice({
	name: "shoppingCart",
	initialState: initialState,
	reducers: {
		addToCart: (state, action) => {
			const itemInCart = state.cart.find(
				(item) =>
					item.stripeProductID === action.payload.stripeProductID
			);

			if (itemInCart) {
				itemInCart.quantity += action.payload.quantity;
			} else {
				state.cart.push({ ...action.payload });
			}

			// running totals
			state.totalAmount +=
				action.payload.quantity * action.payload.unitAmount;
			state.totalQuantity += action.payload.quantity;
		},
		removeItem: (state, action) => {
			const filteredCart = state.cart.filter(
				(item) => item.stripeProductID !== action.payload
			);
			state.cart = filteredCart;
		},
		setCart: (state, action) => {
			state.cart = action.payload;
		},
	},
});

/**
 * Selects the cart product array from the shopping cart Redux state.
 *
 * @function
 * @param {RootState} state - The root redux state of the application.
 * @returns {IProduct[]} The shopping cart array of products from the shopping cart state.
 */
export const selectCart = (state: RootState) => {
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
export const { addToCart, removeItem, setCart } = shoppingCartSlice.actions;
