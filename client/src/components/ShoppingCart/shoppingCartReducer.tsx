import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { formatPrice } from "../Product/productService";
import { ICartProduct } from "./shoppingCartService";

// Typescript + Redux wants an explicit state type and initialization for correct type inferrence
// https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
type ShoppingCartState = {
	cart: ICartProduct[];
	totalAmount: number;
	totalQuantity: number;
};

const initialState: ShoppingCartState = {
	cart: [],
	totalAmount: 0,
	totalQuantity: 0,
};

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
	},
});

export const selectCart = (state: RootState) => {
	return state.shoppingCart.cart;
};

// Returns the cart total as a displayable string
export const selectCartTotalQuantity = (state: RootState) => {
	return state.shoppingCart.totalQuantity;
};

// Returns the cart total as a displayable string
export const selectCartTotalAmount = (state: RootState) => {
	return formatPrice(state.shoppingCart.totalAmount, "USD", 1);
};

export default shoppingCartSlice.reducer;

export const { addToCart, removeItem } = shoppingCartSlice.actions;
