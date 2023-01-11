import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import postContactForm, { IContactForm, schema } from "./contactFormService";
import { useEffect, useState } from "react";

// --- React component
const ContactForm = () => {
	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);

	// setup react form hook library
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		reset,
	} = useForm<IContactForm>({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: IContactForm) => {
		try {
			await postContactForm(data);
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);
			console.log(data);
		} catch (error) {
			setIsSubmissionError(true);
			setIsSuccessfullySubmitted(false);
			console.log(error);
		}
	};

	// Reset form if submission successfull
	// It's recommended to reset in useEffect as execution order matters
	// https://react-hook-form.com/api/useform/reset
	useEffect(() => {
		if (formState.isSubmitSuccessful && !isSubmissionError) {
			// isSubmitSuccessful gets wiped on reset, so remember it
			setIsSuccessfullySubmitted(true);
			reset();
		}
	}, [formState, reset, isSubmissionError]);

	// Standard autocomplete options - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	return (
		<Container className="form-container mb-3">
			{/* Outer container sets up styling using form-container CSS
				Inner container created padding around form  */}
			<Container className="p-4">
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					{/* Success or error message after submission */}
					<Row className="justify-content-md-left">
						<Col md={12} className="mb-3">
							{/* Feedback for successful form submission */}
							{isSuccessfullySubmitted && (
								<Alert variant="success">
									<p className="mb-0">
										Success - Thanks for your message!
									</p>
								</Alert>
							)}
							{/* Feedback for unsuccessful form submission */}
							{isSubmissionError && (
								<Alert variant="danger">
									<p className="mb-0">
										Error occurred while sending message.
										Please try again.
									</p>
								</Alert>
							)}
						</Col>
					</Row>

					{/* Full Name - use full name for better usability as opposed to seperate fields
						xs=9 md=7 makes fields appropriately sized for different screens
					*/}
					<Row className="justify-content-md-left">
						<Col xs={9} md={7} className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								autoComplete="name"
								{...register("name")}
								isInvalid={!!errors.name}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.name?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Email */}
					<Row className="justify-content-md-left">
						<Col xs={9} md={7} className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								autoComplete="email"
								{...register("email")}
								isInvalid={!!errors.email}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.email?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Phone Number*/}
					<Row className="justify-content-md-left">
						<Col xs={9} md={7} className="mb-3">
							<Form.Label>Phone Number (optional)</Form.Label>
							<Form.Control
								type="tel"
								autoComplete="tel"
								{...register("phoneNumber")}
								isInvalid={!!errors.phoneNumber}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.phoneNumber?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Message field - full width*/}
					<Row className="justify-content-md-left">
						<Col md={12} className="mb-3">
							<Form.Label>Message</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								{...register("message")}
								isInvalid={!!errors.message}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.message?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Submit button aligned to the right*/}
					<Row className="justify-content-md-center">
						<Col
							md={12}
							className="mb=3 d-flex justify-content-end"
						>
							<Button
								type="submit"
								disabled={formState.isSubmitting}
							>
								Send Message
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</Container>
	);
};

export default ContactForm;
