import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import Product from "../Product/product";
import ShoppingCart from "../ShoppingCart/shoppingCart";
import { selectCart, setCart } from "../ShoppingCart/shoppingCartReducer";
import { getAll } from "./shopService";

const Shop = () => {
	const [isError, setIsError] = useState(false);

	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// Reference to shopping cart
	const cart = useSelector(selectCart);

	// get all products and add to cart
	useEffect(() => {
		// setup based on https://www.robinwieruch.de/react-hooks-fetch-data/
		const getProducts = async () => {
			setIsError(false);
			try {
				const productList = await getAll();
				dispatch(setCart(productList.products));
			} catch (error) {
				console.log(error);
				setIsError(true);
			}
		};
		getProducts();
	}, [dispatch]);

	if (isError) {
		return (
			<Container id="shop" className="content-container mb-3 py-3 px-3">
				{/* Success or error message after submission */}
				<Row className="justify-content-md-left">
					<Col md={12} className="mb-3">
						{/* Feedback for unsuccessful form submission */}
						{isError && (
							<Alert variant="danger">
								<p className="mb-0">
									Error occurred during setup. Please try
									again.
								</p>
							</Alert>
						)}
					</Col>
				</Row>
			</Container>
		);
	} else if (cart.length <= 0) {
		// don't render anything until we have products to display
		return <div></div>;
	} else {
		return (
			// return store with shopping cart and each product
			<div>
				<ShoppingCart></ShoppingCart>
				{cart.map((each) => {
					return (
						<Product
							key={each.stripeProductID}
							product={each}
						></Product>
					);
				})}
				;
			</div>
		);
	}
};

export default Shop;
