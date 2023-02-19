import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { number, object } from "yup";
import { useAppDispatch } from "../../store";
import { addToCart } from "../ShoppingCart/shoppingCartReducer";
import { formatPrice, IProduct } from "./productService";

export const Product = ({ product }: { product: IProduct }) => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// Yup library provides input validation
	const schema = object({
		quantity: number().required().positive().integer(),
	});

	// setup react form hook library
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		watch,
	} = useForm<IProduct>({
		resolver: yupResolver(schema),
		defaultValues: product,
	});

	// pull quantity value to update price button
	const watchQuantity = watch("quantity", 0);

	const onSubmit = async (data: IProduct) => {
		// react-form-hook handles preventDefault
		try {
			dispatch(addToCart(data));
			// const response = await postCheckoutForm(data);
			// redirect to checkout url
			// window.location.href = response.url;
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container id="product" className="content-container mb-3 py-3 px-3">
			<div>
				<h2>{product.name}</h2>
				<h4>{product.description}</h4>
				<img
					alt="Random asset from Picsum"
					src={product.images[0]}
					width="140"
					height="160"
				/>
			</div>
			<Form noValidate onSubmit={handleSubmit(onSubmit)}>
				<Row className="justify-content-md-left">
					<Col xs={12} md={8} className="mb-3">
						<Form.Label>Quantity</Form.Label>
						<Form.Control
							type="number"
							{...register("quantity")}
							isInvalid={!!errors.quantity}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.quantity?.message}
						</Form.Control.Feedback>
					</Col>
				</Row>

				<p className="sr-legal-text">Number of copies (max 10)</p>

				{/* Submit button aligned to the right*/}
				<Row className="justify-content-md-center">
					<Col md={12} className="mb-3 d-flex justify-content-end">
						<Button type="submit" disabled={formState.isSubmitting}>
							Buy{" "}
							{formatPrice(
								product.unitAmount,
								product.currency,
								watchQuantity
							)}
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default Product;
