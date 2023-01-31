import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import checkoutReducer from "./components/Checkout/checkoutReducer";

// The only thing you should need to do in this file is add reducers
// See - https://redux-toolkit.js.org/tutorials/typescript

/**
 * store contains the centralized state for the application
 */
export const store = configureStore({
	reducer: { checkout: checkoutReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
// https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
