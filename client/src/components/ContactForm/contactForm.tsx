import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import postContactForm from "./contactFormService";

export interface IContactForm {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	message: string;
}
const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup.object({
	firstName: yup.string().required("First Name is required"),
	lastName: yup.string().required("Last Name is required"),
	message: yup.string().required("Message is required"),
	email: yup
		.string()
		.email("Please enter a valid email address")
		.required("Email address is required"),
	phoneNumber: yup.string().matches(phoneRegExp, {
		message: "Please enter a valid phone number",
		excludeEmptyString: true,
	}),
});

const ContactForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IContactForm>({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: IContactForm) => {
		try {
			await postContactForm(data);
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	// Standard autocomplete options - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	return (
		<Container className="form-container mb-3">
			{/* Outer container sets up styling using form-container CSS
				Inner container created padding around form  */}
			<Container className="p-4">
				<Form noValidate onSubmit={handleSubmit(onSubmit)}>
					{/* First name and last name fields which appear on a single row 
						if using a desktop size view */}
					<Row className="justify-content-md-center">
						<Col md={6} className="mb-3">
							<Form.Control
								type="text"
								autoComplete="given-name"
								placeholder="First Name"
								{...register("firstName")}
								isInvalid={!!errors.firstName}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.firstName?.message}
							</Form.Control.Feedback>
						</Col>

						<Col md={6} className="mb-3">
							<Form.Control
								type="text"
								autoComplete="family-name"
								placeholder="Last Name"
								{...register("lastName")}
								isInvalid={!!errors.lastName}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.lastName?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Email and phone number fields which appear on a single row 
						if using a desktop size view */}
					<Row className="justify-content-md-center">
						<Col md={6} className="mb-3">
							<Form.Control
								type="email"
								autoComplete="email"
								placeholder="Email Address"
								{...register("email")}
								isInvalid={!!errors.email}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.email?.message}
							</Form.Control.Feedback>
						</Col>

						<Col md={6} className="mb-3">
							<Form.Control
								type="tel"
								autoComplete="tel"
								placeholder="Phone Number"
								{...register("phoneNumber")}
								isInvalid={!!errors.phoneNumber}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.phoneNumber?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Message field which appear on a single row always */}
					<Row className="justify-content-md-center">
						<Col md={12} className="mb-3">
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Message"
								{...register("message")}
								isInvalid={!!errors.message}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.message?.message}
							</Form.Control.Feedback>
						</Col>
					</Row>

					{/* Submit button aligned to the right*/}
					<Row>
						<Col
							md={12}
							className="mb=3 d-flex justify-content-end"
						>
							<Button type="submit">Submit</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</Container>
	);
};

export default ContactForm;
