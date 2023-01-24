import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ICheckoutForm, schema } from "./checkoutService";

// Copied and modified from https://github.com/stripe-samples/checkout-one-time-payments

const formatPrice = (
	amount: number,
	currency: string,
	quantity: number
): string => {
	const numberFormat = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	});
	const parts = numberFormat.formatToParts(amount);
	let zeroDecimalCurrency = true;
	for (let part of parts) {
		if (part.type === "decimal") {
			zeroDecimalCurrency = false;
		}
	}
	amount = zeroDecimalCurrency ? amount : amount / 100;
	const total = (quantity * amount).toFixed(2);
	return total;
};

const Checkout = () => {
	const [amount, setAmount] = useState(0);
	const [currency, setCurrency] = useState("USD");

	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);

	useEffect(() => {
		async function fetchConfig() {
			// Fetch config from our backend.
			const { unitAmount, currency } = await fetch(
				"/api/checkout_config"
			).then((r) => r.json());
			setAmount(unitAmount);
			setCurrency(currency);
		}
		fetchConfig();
	}, []);

	const onSubmit = (e: React.FormEvent<HTMLInputElement>) => {
		e.preventDefault();
		try {
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);
		} catch (error) {
			setIsSubmissionError(true);
			setIsSuccessfullySubmitted(false);
			console.log("Submit error");
			console.log(error);
		}
	};

	// setup react form hook library
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		getValues,
	} = useForm<ICheckoutForm>({
		resolver: yupResolver(schema),
	});

	return (
		<Container id="checkout" className="content-container mb-3 py-3 px-3">
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

			<div>
				<h2>Single photo</h2>
				<h4>Purchase a Pasha original photo</h4>
				<img
					alt="Random asset from Picsum"
					src="https://picsum.photos/280/320?random=4"
					width="140"
					height="160"
				/>
			</div>
			{/* Use form method and action instead of ajax onSubmit because reasons*/}
			<Form
				noValidate
				action="/api/checkout"
				method="POST"
				onSubmit={handleSubmit((e: React.FormEvent<HTMLFormElement>) =>
					onSubmit(e)
				)}
			>
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
								amount,
								currency,
								getValues("quantity")
							)}
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default Checkout;
