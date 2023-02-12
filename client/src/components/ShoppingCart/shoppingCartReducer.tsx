import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ICartProduct } from "./shoppingCartService";

// Typescript + Redux wants an explicit state type and initialization for correct type inferrence
// https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
type ShoppingCartState = {
	cart: ICartProduct[];
};

const initialState: ShoppingCartState = {
	cart: [],
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
		},
		incrementQuantity: (state, action) => {
			const itemInCart = state.cart.find(
				(item) => item.stripeProductID === action.payload
			);
			if (itemInCart) {
				itemInCart.quantity++;
			}
		},
		decrementQuantity: (state, action) => {
			const itemInCart = state.cart.find(
				(item) => item.stripeProductID === action.payload
			);
			if (itemInCart) {
				if (itemInCart.quantity === 1) {
					itemInCart.quantity = 1;
				} else {
					itemInCart.quantity--;
				}
			}
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

export default shoppingCartSlice.reducer;

export const { addToCart, incrementQuantity, decrementQuantity, removeItem } =
	shoppingCartSlice.actions;
