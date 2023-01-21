import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "react-responsive";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import postContactForm, { IContactForm, schema } from "./contactFormService";

// --- React component
const ContactFormRecaptcha = () => {
	// track form submission success or error
	const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] =
		useState(false);
	const [isSubmissionError, setIsSubmissionError] = useState(false);
	// track if recaptcha has been submitted
	const [isRecaptchaSubmitted, setIsRecapthcaSubmitted] = useState(false);
	// track if mobile screen size to resize reCAPTHCA
	const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

	// setup react form hook library
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		reset,
		setValue,
	} = useForm<IContactForm>({
		resolver: yupResolver(schema),
	});

	// setup reCAPTCHA
	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const onSubmit = async (data: IContactForm) => {
		try {
			await postContactForm(data);
			setIsSubmissionError(false);
			setIsSuccessfullySubmitted(false);

			console.log(data);
		} catch (error) {
			setIsSubmissionError(true);
			setIsSuccessfullySubmitted(false);
			setIsRecapthcaSubmitted(false);
			console.log(error);
		}
	};

	// Handle reCAPTHCA updates
	const onChange = () => {
		if (recaptchaRef.current) {
			// Track if reCAPTCHA is filled for form validation
			setIsRecapthcaSubmitted(true);
			// Add recaptcha value to our form struct
			setValue("recaptcha", recaptchaRef.current.getValue()!);
		}
	};

	// Reset form if submission successfull
	// It's recommended to reset in useEffect as execution order matters
	// https://react-hook-form.com/api/useform/reset
	useEffect(() => {
		if (formState.isSubmitSuccessful && !isSubmissionError) {
			// isSubmitSuccessful gets wiped on reset, so remember it so we can display a success banner on reload
			setIsSuccessfullySubmitted(true);
			reset();
		}
	}, [formState, reset, isSubmissionError]);

	// Standard autocomplete options - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	return (
		<Container
			id="contact_form"
			className="content-container mb-3 py-3 px-3"
		>
			<h3>Send a message</h3>
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
									Error occurred while sending message. Please
									try again.
								</p>
							</Alert>
						)}
					</Col>
				</Row>

				{/* Full Name - use full name for better usability as opposed to seperate fields
						xs=9 md=7 makes fields appropriately sized for different screens
					*/}
				<Row className="justify-content-md-left">
					<Col xs={12} md={8} className="mb-3">
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
					<Col xs={12} md={8} className="mb-3">
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
					<Col xs={12} md={8} className="mb-3">
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
							rows={4}
							{...register("message")}
							isInvalid={!!errors.message}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.message?.message}
						</Form.Control.Feedback>
					</Col>
				</Row>

				{/* reCAPTCHA v2 button aligned to the right
						Resizes if using a mobile screen to make somewhat responsive*/}
				<Row className="justify-content-md-center">
					<Col md={12} className="mb-3 d-flex justify-content-end">
						{isMobile ? (
							<ReCAPTCHA
								sitekey={process.env.RECAPTCHA_SITE_KEY!}
								ref={recaptchaRef}
								onChange={onChange}
								size="compact"
							/>
						) : (
							<ReCAPTCHA
								sitekey={
									"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
								}
								ref={recaptchaRef}
								onChange={onChange}
								size="normal"
							/>
						)}
					</Col>
				</Row>

				{/* Submit button aligned to the right*/}
				<Row className="justify-content-md-center">
					<Col md={12} className="mb-3 d-flex justify-content-end">
						<Button
							type="submit"
							disabled={
								formState.isSubmitting || !isRecaptchaSubmitted
							}
						>
							Send Message
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default ContactFormRecaptcha;
