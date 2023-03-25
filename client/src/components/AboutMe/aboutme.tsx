import { Col, Container, Image, Row } from "react-bootstrap";
// Use import for images so webpack handles it
import profileImgSrc from "../../images/profile.jpg";

/**
 * The AboutMe component that renders information about the developer.
 *
 * @function
 * @returns {JSX.Element} The rendered section with the developer's profile image and description.
 *
 * @description
 * This component displays a section with the developer's profile image and a brief
 * description of their background or experience. The component uses the `react-bootstrap`
 * library to display the content in a responsive layout. The profile image is displayed
 * as a circular image using the `Image` component.
 * The component also includes an `id` attribute for the section, which can
 * be used to link to this section from other parts of the page.
 */
const AboutMe = () => {
	return (
		<Container id="about" className="content-container mb-3 py-3 px-3">
			<Row className="align-items-center justify-content-center">
				<Col xs={5} md={3}>
					<Image
						roundedCircle
						className="profile-img"
						src={profileImgSrc}
					></Image>
				</Col>
				<Col xs={12} md={9}>
					<h3>About me</h3>
					<p>
						Lorem Ipsum is simply dummy text of the printing and
						typesetting industry. Lorem Ipsum has been the
						industry's standard dummy text ever since the 1500s,
						when an unknown printer took a galley of type and
						scrambled it to make a type specimen book. It has
						survived not only five centuries, but also the leap into
						electronic typesetting, remaining essentially unchanged.
						It was popularised in the 1960s with the release of
						Letraset sheets containing Lorem Ipsum passages, and
						more recently with desktop publishing software like
						Aldus PageMaker including versions of Lorem Ipsum.
					</p>
				</Col>
			</Row>
		</Container>
	);
};

export default AboutMe;
