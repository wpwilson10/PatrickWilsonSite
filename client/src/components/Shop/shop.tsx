import { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import Product from "../Product/product";
import { IProduct } from "../Product/productService";
import {
	selectCartProducts,
	selectIsCheckoutError,
	selectIsCheckoutSuccess,
	setCart,
	setIsCheckoutError,
	setIsCheckoutSuccess,
} from "../ShoppingCart/shoppingCartReducer";
import { ShoppingCart } from "../ShoppingCart/shoppingCart";
import { getAll } from "./shopService";

/**
 * Renders the Shop page which displays all products and the shopping cart.
 *
 * @returns {JSX.Element} The Shop page component.
 */
const Shop = () => {
	// use context here because the shop setup error is localized to just this component
	const [isError, setIsError] = useState(false);

	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// Reference to shopping cart
	const cart = useSelector(selectCartProducts);

	// track checkout error or success to show feedback notifications
	const isCheckoutError = useSelector(selectIsCheckoutError);
	const isCheckoutSuccess = useSelector(selectIsCheckoutSuccess);

	// initialization - get all products and add to cart
	useEffect(() => {
		// only do setup if there is nothing in shop
		if (cart === undefined || cart.length === 0) {
			// setup based on https://www.robinwieruch.de/react-hooks-fetch-data/
			const getProducts = async () => {
				setIsError(false);
				try {
					const productList = await getAll();
					dispatch(
						setCart({
							products: productList.products,
						})
					);
				} catch (error) {
					console.log(error);
					setIsError(true);
				}
			};
			getProducts();
		}
	}, [cart, dispatch]);

	// Check to see if this is a redirect back from Checkout
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);

		if (query.get("success")) {
			dispatch(setIsCheckoutError(false));
			dispatch(setIsCheckoutSuccess(true));
		}

		if (query.get("canceled")) {
			dispatch(setIsCheckoutError(true));
			dispatch(setIsCheckoutSuccess(false));
		}
	}, [dispatch]);

	if (isError) {
		// Feedback notifcation if there was an error during shop setup
		return (
			<Container id="shop" className="content-container mb-3 py-3 px-3">
				{isError && (
					<Alert variant="danger">
						<p className="mb-0">
							Error occurred during setup. Please try again.
						</p>
					</Alert>
				)}
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
