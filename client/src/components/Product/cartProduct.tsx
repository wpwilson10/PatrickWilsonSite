import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { useAppDispatch } from "../../store";
import { setProductQuantity } from "../ShoppingCart/shoppingCartReducer";
import { productQuantity } from "../ShoppingCart/shoppingCartService";
import { formatPrice, IProduct } from "./productService";

export const CartProduct = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const decrementQuantity = () => {
		if (product.quantity > 0) {
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

	return (
		<Container id="product" className="content-container py-3 px-3">
			<Row className="justify-content-center">
				<Col xs={4}>
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
					></Image>
				</Col>
				<Col xs={4}>
					<Row>{product.name}</Row>
					<Row>${formatPrice(product.unitAmount, "USD", 1)}</Row>
				</Col>
				<Col
					xs={4}
					className="mb-3 d-flex justify-content-end align-items-center"
				>
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
			<Row></Row>
		</Container>
	);
};

export default CartProduct;
