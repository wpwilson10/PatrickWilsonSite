import {
	Button,
	Col,
	Container,
	Form,
	Row,
	Image,
	InputGroup,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { addToCart } from "../ShoppingCart/shoppingCartReducer";
import { IProduct } from "./productService";

export const Product = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// setup react form hook library
	const {
		register,
		formState: { errors },
	const { handleSubmit, setValue, watch } = useForm<IProduct>({
		defaultValues: product,
	});

	const watchQuantity = watch("quantity"); // you can supply default value as second argument

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
			<Row>
				<Col>
					<h3>{product.name}</h3>
				</Col>
			</Row>
			<Row className="align-items-center justify-content-center">
				<Col xs={12} md={9}>
					<p>{product.description}</p>
				</Col>
				<Col xs={5} md={3}>
					<Image
						rounded
						className="profile-img"
						src={product.images[0]}
					></Image>
				</Col>
			</Row>

			<Form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Row className="justify-content-end pb-3">
					<Col xs={6} md={3}>
						<Form.Label>Quantity</Form.Label>
						<InputGroup className="mb-3">
							<Button
								variant="outline-secondary"
								className="quantity-selector-input"
								onClick={() => {
									if (watchQuantity > 0) {
										setValue("quantity", watchQuantity - 1);
									}
								}}
							>
								-
							</Button>
							<InputGroup.Text className="quantity-selector-text">
								{watchQuantity}
							</InputGroup.Text>
							<Button
								variant="outline-secondary"
								className="quantity-selector-input"
								onClick={() => {
									setValue("quantity", watchQuantity + 1);
								}}
							>
								+
							</Button>{" "}
						</InputGroup>
					</Col>
				</Row>
				<Row className="justify-content-md-center">
					{/* Submit button aligned to the right*/}
					<Col className="mb-3 d-flex justify-content-end">
						<Button type="submit">Add to Cart</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default Product;
