import { Container } from "react-bootstrap";
import ContactFormRecaptcha from "../ContactForm/contactFormRecaptcha";

// --- React component
const ContactInfoInner = () => {
	return (
		<Container className="contact-container mb-3">
			{/* Outer container sets up styling using form-container CSS
				Inner container created padding around form  */}
			<Container className="p-4">
				<h3>Contact Information</h3>
				<p>Email: person@gmail.com</p>
				<p>Github: acccount@github.com</p>
			</Container>
		</Container>
	);
};

// --- React component
const ContactInfo = () => {
	return (
		<div>
			<ContactInfoInner></ContactInfoInner>
			<ContactFormRecaptcha></ContactFormRecaptcha>
		</div>
	);
};

export default ContactInfo;
