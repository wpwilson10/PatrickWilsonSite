import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
	selectCart,
	selectCartTotalAmount,
	selectCartTotalQuantity,
} from "./shoppingCartReducer";
import postCartCheckout from "./shoppingCartService";

const ShoppingCart = () => {
	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);
	const cart = useSelector(selectCart);
	const amount = useSelector(selectCartTotalAmount);
	const quantity = useSelector(selectCartTotalQuantity);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (quantity <= 0) {
			// don't submit to server if there is nothing
			setIsEmpty(true);
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);
			return;
		} else {
			setIsEmpty(false);
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);
		}

		try {
			const response = await postCartCheckout(cart);
			// redirect to checkout url
			window.location.href = response.url;
		} catch (error) {
			setIsSubmissionError(true);
		}
	};

	useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		const query = new URLSearchParams(window.location.search);

		if (query.get("success")) {
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(true);
		}

		if (query.get("canceled")) {
			setIsSubmissionError(true);
			setIsSuccessfullySubmitted(false);
		}
	}, []);

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
					{/* Feedback for empty submission */}
					{isEmpty && (
						<Alert variant="warning">
							<p className="mb-0">No items in cart.</p>
						</Alert>
					)}
				</Col>
			</Row>

			<div>Total: {amount}</div>

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
