import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { useAppDispatch } from "../../store";
import {
	setIsOpen,
	setProductQuantity,
} from "../ShoppingCart/shoppingCartReducer";
import { productQuantity } from "../ShoppingCart/shoppingCartService";
import { formatPrice, IProduct } from "./productService";

export const Product = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const addProduct = () => {
		const updateQuantity: productQuantity = {
			productID: product.stripeProductID,
			quantity: product.quantity + 1,
		};
		dispatch(setProductQuantity(updateQuantity));
		dispatch(setIsOpen(true));
	};

	return (
		<Container id="product" className="content-container mb-3 py-3 px-3">
			<Row className="justify-content-center">
				<Col xs={9} md={3} className="mb-3">
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
					></Image>
				</Col>
				<Col xs={12} md={9}>
					<Row>
						<h3>{product.name}</h3>
					</Row>
					<Row>
						<h4>${formatPrice(product.unitAmount, "USD", 1)}</h4>
					</Row>
					<Row>
						<p>{product.description}</p>
					</Row>
				</Col>
			</Row>

			<Row className="justify-content-md-center">
				{/* Submit button aligned to the right*/}
				<Col md={12} className="mb-3 d-flex justify-content-end">
					<Button type="submit" onClick={addProduct}>
						Add to Cart
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default Product;
