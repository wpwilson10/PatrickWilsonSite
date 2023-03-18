import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { addToCart } from "../ShoppingCart/shoppingCartReducer";
import { formatPrice, IProduct } from "./productService";

export const Product = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// setup react form hook library
	const { handleSubmit, watch, setValue } = useForm<IProduct>({
		defaultValues: product,
	});

	const watchQuantity = watch("quantity");
	const decrementQuantity = () => {
		if (watchQuantity > 0) {
			setValue("quantity", watchQuantity - 1);
		}
	};
	const incrementQuantiy = () => {
		setValue("quantity", watchQuantity + 1);
	};

	const onSubmit = async (data: IProduct) => {
		// react-form-hook handles preventDefault
		try {
			dispatch(addToCart(data));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container id="product" className="content-container mb-3 py-3 px-3">
			<Row className="justify-content-center">
				<Col xs={9} md={4} className="mb-3">
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
					></Image>
				</Col>
				<Col xs={12} md={8}>
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
			<Form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col
						md={12}
						className="mb-3 d-flex justify-content-end align-items-center"
					>
						<Button
							className="quantity-selector-input py-0"
							onClick={decrementQuantity}
						>
							-
						</Button>
						<div className="quantity-selector-text mx-2">
							{watchQuantity}
						</div>
						<Button
							className="quantity-selector-input py-0"
							onClick={incrementQuantiy}
						>
							+
						</Button>
					</Col>
				</Row>
				<Row className="justify-content-md-center">
					{/* Submit button aligned to the right*/}
					<Col md={12} className="mb-3 d-flex justify-content-end">
						<Button type="submit" disabled={watchQuantity < 1}>
							Add to Cart
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default Product;
