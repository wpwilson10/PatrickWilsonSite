import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICheckoutForm } from "./checkoutService";

// Typescript + Redux wants an explicit state type and initialization for correct type inferrence
// https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
type CheckoutState = {
	products: ICheckoutForm[];
};

const initialState: CheckoutState = {
	products: [],
};

const checkoutSlice = createSlice({
	name: "checkout",
	initialState,
	reducers: {
		addCheckout(state, action: PayloadAction<ICheckoutForm>) {
			console.log(action.payload);
			state.products.push(action.payload);
		},
	},
});

export const { addCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
