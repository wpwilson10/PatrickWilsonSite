import { Col, Container, Image, Row } from "react-bootstrap";
// Use import for images so webpack handles it
import profileImgSrc from "../../images/Bmo_Guitar.jpg";

// --- React component
const AboutMe = () => {
	return (
		<Container className="aboutme-container mb-3">
			{/* Outer container sets up styling using form-container CSS
				Inner container created padding around form  */}
			<Container className="p-4">
				<Row className="align-items-center">
					<Col xs={12} md={3}>
						<Image
							roundedCircle
							className="profile-img"
							src={profileImgSrc}
						></Image>
					</Col>
					<Col>
						<h3>About me</h3>
						<p>
							Lorem Ipsum is simply dummy text of the printing and
							typesetting industry. Lorem Ipsum has been the
							industry's standard dummy text ever since the 1500s,
							when an unknown printer took a galley of type and
							scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap
							into electronic typesetting, remaining essentially
							unchanged. It was popularised in the 1960s with the
							release of Letraset sheets containing Lorem Ipsum
							passages, and more recently with desktop publishing
							software like Aldus PageMaker including versions of
							Lorem Ipsum.
						</p>
					</Col>
				</Row>
			</Container>
		</Container>
	);
};

export default AboutMe;
