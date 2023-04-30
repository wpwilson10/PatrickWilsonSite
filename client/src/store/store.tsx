import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import shoppingCartReducer from "./shoppingCart";
import { logErrorToServer } from "../utils/error";

// The only thing you should need to do in this file is add reducers
// See - https://redux-toolkit.js.org/tutorials/typescript

/**
 * The centralized redux store object that holds the entire state tree of the application.
 */
export const store = configureStore({
	reducer: { shoppingCart: shoppingCartReducer },
	preloadedState: loadFromLocalStorage(),
});

// convert object to string and store in localStorage
// https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
function saveToLocalStorage(state: RootState) {
	try {
		const serialisedState = JSON.stringify(state);
		localStorage.setItem("store", serialisedState);
	} catch (e) {
		console.warn(e);
	}
}

// load string from localStarage and convert into an Object
// invalid output must be undefined
// https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
function loadFromLocalStorage() {
	try {
		const serialisedState = localStorage.getItem("store");
		if (serialisedState === null) return undefined;

		let state = JSON.parse(serialisedState);

		// basic type guard
		if (
			state &&
			state.shoppingCart &&
			state.shoppingCart.cart &&
			state.shoppingCart.timeStamp
		) {
			// check if cart is less than 24 hours old
			if (
				Date.now() - state.shoppingCart.timeStamp <
				24 * 60 * 60 * 1000
			) {
				// got good current data, so return state
				return state;
			}
		}

		// otherwise reinitialize
		return undefined;
	} catch (e) {
		logErrorToServer(e, "loadFromLocalStorage");
		return undefined;
	}
}

// https://stackoverflow.com/questions/68421040/local-storage-using-redux-toolkit
store.subscribe(() => saveToLocalStorage(store.getState()));

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
// https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
