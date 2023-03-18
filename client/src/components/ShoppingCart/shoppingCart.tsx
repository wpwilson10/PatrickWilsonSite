import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
	selectCartProducts,
	selectCartTotalAmount,
	selectCartTotalQuantity,
} from "./shoppingCartReducer";
import postCartCheckout from "./shoppingCartService";

/**
 * A React component that displays the total quantity and price amount of items
 * in the user's shopping cart and allows them to checkout.
 *
 * @returns JSX element for the shopping cart page.
 */
const ShoppingCart = () => {
	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);
	const cart = useSelector(selectCartProducts);
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
			className="content-container mb-3 py-2 px-2"
		>
			{/* Success or error message after submission */}
			{isSuccessfullySubmitted || isSubmissionError || isEmpty ? (
				<Row className="justify-content-md-left mt-2">
					<Col md={12}>
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
			) : null}

			<Form noValidate onSubmit={onSubmit}>
				{/* Total with submit button aligned to the right*/}
				<Row className="justify-content-md-left align-items-center mb-2 mt-2">
					<Col xs={6} md={4}>
						<h4>Items in Cart: {quantity}</h4>
					</Col>
					<Col xs={6} md={4}>
						<h4>Total: {amount}</h4>
					</Col>
					<Col
						xs={12}
						md={4}
						className="d-flex justify-content-end mt-2"
					>
						<Button type="submit">Checkout</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default ShoppingCart;
