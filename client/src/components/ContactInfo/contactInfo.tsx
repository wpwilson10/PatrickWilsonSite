import { Col, Container, Row } from "react-bootstrap";
import ContactFormRecaptcha from "../ContactForm/contactFormRecaptcha";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// --- React component
const ContactInfoInner = () => {
	return (
		<Container className="contact-container mb-3 py-3 px-3">
			{/* Outer container sets up styling using form-container CSS
				Inner container created padding around form  */}
			<h3>Contact Information</h3>
			<p></p>
			<p>Email: person@gmail.com</p>
			<Row className="justify-content-start">
				<Col xs={12} md="auto">
					{/* GitHub Icon and Link 
							Target and Rel options cause the link to open in a new tab */}
					<a
						href="http://github.com/wpwilson10"
						target="_blank"
						rel="noopener noreferrer"
						className="link-no-decoration"
					>
						<div className="contact-link-container">
							<FaGithub size="2em" />
							<div className="contact-link-text">GitHub</div>
						</div>
					</a>
				</Col>
				<Col xs={12} md="auto">
					{/* LinkedIn Icon and Link
							Target and Rel options cause the link to open in a new tab */}
					<a
						href="https://linkedin.com"
						target="_blank"
						rel="noopener noreferrer"
						className="link-no-decoration"
					>
						<div className="contact-link-container">
							<FaLinkedin size="2em" />
							<div className="contact-link-text">LinkedIn</div>
						</div>
					</a>
				</Col>
				<Col xs={12} md="auto">
					{/* Opens email */}
					<a
						href="mailto:wpwilson10@gmail.com"
						className="link-no-decoration"
					>
						<div className="contact-link-container">
							<MdEmail size="2em" />
							<div className="contact-link-text">Email</div>
						</div>
					</a>
				</Col>
			</Row>
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
