import { Button, Col, Container, Row, Image, Stack } from "react-bootstrap";
import { useAppDispatch } from "../../store";
import {
	removeItem,
	setProductQuantity,
} from "../ShoppingCart/shoppingCartReducer";
import { productQuantity } from "../ShoppingCart/shoppingCartService";
import { formatPrice, IProduct } from "./productService";

export const CartProduct = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const decrementQuantity = () => {
		// don't allow less than one in cart
		// Use remove button instead of decrementing to 0
		if (product.quantity > 1) {
			const updateQuantity: productQuantity = {
				productID: product.stripeProductID,
				quantity: product.quantity - 1,
			};
			dispatch(setProductQuantity(updateQuantity));
		}
	};
	const incrementQuantiy = () => {
		const updateQuantity: productQuantity = {
			productID: product.stripeProductID,
			quantity: product.quantity + 1,
		};
		dispatch(setProductQuantity(updateQuantity));
	};

	const removeProduct = () => {
		dispatch(removeItem(product));
	};

	return (
		<Container id="product" className="cart-product-container px-0 py-1">
			<Row className="mb-3">
				<Col xs={3} className="d-flex justify-content-start">
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
					></Image>
				</Col>
				<Col xs={9} className="d-flex justify-content-end">
					<Stack gap={1}>
						<h5>{product.name}</h5>
						<h6>${formatPrice(product.unitAmount, "USD", 1)}</h6>
					</Stack>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col className="d-flex justify-content-start align-items-center">
					<Button variant="outline-danger" onClick={removeProduct}>
						&times;
					</Button>
				</Col>
				<Col className="d-flex flex-row justify-content-end align-items-center">
					<Button
						className="quantity-selector-input py-0"
						onClick={decrementQuantity}
					>
						-
					</Button>
					<div className="quantity-selector-text mx-2">
						{product.quantity}
					</div>
					<Button
						className="quantity-selector-input py-0"
						onClick={incrementQuantiy}
					>
						+
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default CartProduct;
