import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import postCheckoutForm, {
	ICheckoutForm,
	schema,
} from "../Checkout/checkoutService";
import { formatPrice, getAll, IProduct, IProductList } from "./productService";

const initialList: IProductList = {
	products: [],
};

export const AllProducts = () => {
	const [products, setProducts] = useState(initialList);
	// track loading success or error
	const [, setIsError] = useState(false);

	useEffect(() => {
		// setup based on https://www.robinwieruch.de/react-hooks-fetch-data/
		const getProducts = async () => {
			setIsError(false);
			try {
				const ps = await getAll();
				setProducts(ps);
			} catch (error) {
				console.log(error);
				setIsError(true);
			}
		};
		getProducts();
	}, []);

	// don't render anything until we have products to display
	if (products.products.length > 0) {
		return (
			<div>
				{products.products.map((p) => (
					<Product key={p.stripeProductID} product={p}></Product>
				))}
			</div>
		);
	} else {
		return <div></div>;
	}
};

export const Product = ({ product }: { product: IProduct }) => {
	// setup react form hook library
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		watch,
		setValue,
	} = useForm<ICheckoutForm>({
		resolver: yupResolver(schema),
	});

	// pull quantity value to update price button
	const watchQuantity = watch("quantity", 0);
	// send product info to checkout
	setValue("stripePriceID", product.stripePriceID);

	const onSubmit = async (data: ICheckoutForm) => {
		// react-form-hook handles preventDefault
		try {
			const response = await postCheckoutForm(data);
			// redirect to checkout url
			window.location.href = response.url;
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
						<Form.Label>Name</Form.Label>
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
