import { Button, Col, Offcanvas, Row, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import CartProduct from "../Product/cartProduct";
import { IProduct } from "../Product/productService";
import {
	selectCartProducts,
	selectCartTotalAmount,
	selectCartTotalQuantity,
	selectIsOpen,
	setIsCheckoutError,
	setIsCheckoutSuccess,
	setIsOpen,
} from "./shoppingCartReducer";
import postCartCheckout from "./shoppingCartService";

export const ShoppingCart = () => {
	const cart = useSelector(selectCartProducts);
	const amount = useSelector(selectCartTotalAmount);
	const quantity = useSelector(selectCartTotalQuantity);
	const isOpen = useSelector(selectIsOpen);

	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// putting the dispatch directly in the onHide property caused errors for some reason
	const closeCart = () => {
		dispatch(setIsOpen(false));
	};

	const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		dispatch(setIsCheckoutError(false));
		dispatch(setIsCheckoutSuccess(false));

		try {
			const response = await postCartCheckout(cart);
			// redirect to checkout url
			window.location.href = response.url;
		} catch (error) {
			dispatch(setIsCheckoutError(true));
		}
	};

	// only show items in cart that  have nonzero quantity
	const cartItems = cart.filter((product: IProduct) => product.quantity > 0);

	return (
		<Offcanvas
			id="shoppingCart"
			show={isOpen}
			onHide={closeCart}
			placement="end"
		>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Cart</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Stack gap={2}>
					{cartItems.map((item: IProduct) => (
						<CartProduct
							key={item.stripeProductID}
							product={item}
						></CartProduct>
					))}
					<Row>
						<Col className="d-flex justify-content-start">
							<h5>Items: {quantity}</h5>
						</Col>
						<Col className="d-flex justify-content-end">
							<h5>Total: ${amount}</h5>
						</Col>
					</Row>
					<Col className="d-flex justify-content-end">
						<Button onClick={onSubmit}>Checkout</Button>
					</Col>
				</Stack>
			</Offcanvas.Body>
		</Offcanvas>
	);
};
