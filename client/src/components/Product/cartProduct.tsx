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
		dispatch(removeItem(product.stripeProductID));
	};

	return (
		<Container id="product" className="content-container py-3 px-3">
			<Row className="mb-3">
				<Col xs={8}>
					<Stack gap={1}>
						<h4>{product.name}</h4>
						<h5>${formatPrice(product.unitAmount, "USD", 1)}</h5>
					</Stack>
				</Col>
				<Col xs={4} className="justify-content-end">
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
					></Image>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col className="d-flex flex-row justify-content-start align-items-center">
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
				<Col className="d-flex justify-content-end align-items-center">
					<Button variant="danger" onClick={removeProduct}>
						Remove
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default CartProduct;
