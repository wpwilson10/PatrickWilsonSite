import { Button, Offcanvas, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import { IProduct } from "../Product/productService";
import {
	selectCartProducts,
	selectCartTotalAmount,
	selectIsOpen,
	setIsOpen,
} from "./shoppingCartReducer";
import postCartCheckout from "./shoppingCartService";

export const ShoppingCartSide = () => {
	const cart = useSelector(selectCartProducts);
	const amount = useSelector(selectCartTotalAmount);
	const isOpen = useSelector(selectIsOpen);

	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const closeCart = () => {
		dispatch(setIsOpen(false));
	};

	const onSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault();

		try {
			const response = await postCartCheckout(cart);
			// redirect to checkout url
			window.location.href = response.url;
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Offcanvas show={isOpen} onHide={closeCart} placement="end">
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Cart</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<Stack gap={3}>
					{cart.map((item: IProduct) => (
						<div>{item.name}</div>
					))}
					<div className="ms-auto fw-bold fs-5">Total: {amount}</div>
				</Stack>
				<Button onClick={onSubmit}>Checkout</Button>
			</Offcanvas.Body>
		</Offcanvas>
	);
};
