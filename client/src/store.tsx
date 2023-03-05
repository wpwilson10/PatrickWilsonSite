import { configureStore, Store } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import shoppingCartReducer from "./components/ShoppingCart/shoppingCartReducer";

// The only thing you should need to do in this file is add reducers
// See - https://redux-toolkit.js.org/tutorials/typescript

/**
 * The centralized redux store object that holds the entire state tree of the application.
 *
 * @typedef {import('@reduxjs/toolkit').EnhancedStore} Store
 * @type {Store}
 */
export const store: Store = configureStore({
	reducer: { shoppingCart: shoppingCartReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript#define-root-state-and-dispatch-types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
// https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
