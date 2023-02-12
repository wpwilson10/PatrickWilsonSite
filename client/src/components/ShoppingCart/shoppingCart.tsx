import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCart } from "./shoppingCartReducer";
import postCartCheckout from "./shoppingCartService";

const ShoppingCart = () => {
	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);
	const cart = useSelector(selectCart);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await postCartCheckout(cart);
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);
			// redirect to checkout url
			window.location.href = response.url;
		} catch (error) {
			setIsSubmissionError(true);
			setIsSuccessfullySubmitted(false);
		}
	};

	return (
		<Container
			id="shoppingCart"
			className="content-container mb-3 py-3 px-3"
		>
			{/* Success or error message after submission */}
			<Row className="justify-content-md-left">
				<Col md={12} className="mb-3">
					{/* Feedback for successful form submission */}
					{isSuccessfullySubmitted && (
						<Alert variant="success">
							<p className="mb-0">
								Success - Thanks for your support!
							</p>
						</Alert>
					)}
					{/* Feedback for unsuccessful form submission */}
					{isSubmissionError && (
						<Alert variant="danger">
							<p className="mb-0">
								Error occurred during checkout. Please try
								again.
							</p>
						</Alert>
					)}
				</Col>
			</Row>

			<Form noValidate onSubmit={onSubmit}>
				{/* Submit button aligned to the right*/}
				<Row className="justify-content-md-center">
					<Col md={12} className="mb-3 d-flex justify-content-end">
						<Button type="submit">Checkout</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default ShoppingCart;
