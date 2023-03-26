import { useEffect } from "react";
import { Alert, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import Product from "../Product/product";
import { IProduct } from "../Product/productService";
import {
	initializeStore,
	selectCartProducts,
	selectIsCheckoutError,
	selectIsCheckoutSuccess,
	selectIsSetupError,
	setIsCheckoutError,
	setIsCheckoutSuccess,
	setIsOpen,
} from "../ShoppingCart/shoppingCartReducer";
import { ShoppingCart } from "../ShoppingCart/shoppingCart";

/**
 * Renders the Shop page which displays all products and the shopping cart.
 *
 * @returns {JSX.Element} The Shop page component.
 */
const Shop = () => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// Reference to shopping cart
	const cart = useSelector(selectCartProducts);

	// track checkout error or success and setup error to show feedback notifications
	const isCheckoutError = useSelector(selectIsCheckoutError);
	const isCheckoutSuccess = useSelector(selectIsCheckoutSuccess);
	const isSetupError = useSelector(selectIsSetupError);

	// initialization - get all products and add to cart
	useEffect(() => {
		// do setup if there is nothing in shop
		if (cart === undefined || cart.length === 0) {
			dispatch(initializeStore());
		}
	}, [cart, dispatch]);

	// Check to see if this is a redirect back from Checkout
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		// always close shopping cart sidebar when loading shop
		dispatch(setIsOpen(false));

		if (query.get("success")) {
			// reset store and show success message
			dispatch(initializeStore());
			dispatch(setIsCheckoutSuccess(true));
		} else if (query.get("canceled")) {
			dispatch(setIsCheckoutError(true));
			dispatch(setIsCheckoutSuccess(false));
		} else {
			// clear checkout messages on new visit/reload
			dispatch(setIsCheckoutError(false));
			dispatch(setIsCheckoutSuccess(false));
		}
	}, [dispatch]);

	if (isSetupError) {
		// Feedback notifcation if there was an error during shop setup
		return (
			<Container id="shop" className="content-container mb-3 py-3 px-3">
				<Alert variant="danger">
					<p className="mb-0">
						Error occurred during setup. Please try again.
					</p>
				</Alert>
			</Container>
		);
	} else if (cart.length <= 0) {
		// don't render anything until we have products to display
		return <div></div>;
	} else {
		return (
			// Display feedback notifications followed by store with each product.
			// Includes the shopping cart sidebar overlay component
			<div>
				{/* Feedback for successful form submission */}
				{isCheckoutSuccess && (
					<Alert variant="success">
						<p className="mb-0">
							Success - Thanks for your support!
						</p>
					</Alert>
				)}
				{/* Feedback for unsuccessful form submission */}
				{isCheckoutError && (
					<Alert variant="danger">
						<p className="mb-0">
							Error occurred during checkout. Please try again.
						</p>
					</Alert>
				)}
				{/* List each product in its own component container */}
				{cart.map((each: IProduct) => {
					return (
						<Product
							key={each.stripeProductID}
							product={each}
						></Product>
					);
				})}
				{/* Shopping Cart that shows selected products in sidebar when populated */}
				<ShoppingCart></ShoppingCart>
			</div>
		);
	}
};

export default Shop;
