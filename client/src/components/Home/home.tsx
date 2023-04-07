import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import AboutMe from "../AboutMe/aboutme";
import { ContactInfo } from "../ContactInfo/contactInfo";

/**
 * The Home component that renders the main content of the home page.
 * @function
 * @returns {JSX.Element} The rendered home page content.
 *
 * @description
 * This component displays the main content of the home page, including a title,
 * a brief description, and some additional sections with information about the
 * developer (AboutMe) and contact information (ContactInfo). The component also
 * includes code to enable smooth scrolling to a specific section of the page based
 * on the URL hash value. The smooth scrolling code is based on the solution provided
 * in this Stack Overflow post: https://stackoverflow.com/questions/61779236/how-to-navigate-to-another-page-with-a-smooth-scroll-on-a-specific-id-with-react.
 */
const Home = () => {
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			scroller.scrollTo(location.hash.slice(1), {
				smooth: true,
				offset: -70,
				duration: 200,
			});
		}
	}, [location]);

	return (
		<div>
			<Container id="home" className="content-container mb-3 py-3 px-3">
				<h2>WPW App</h2>
				<p>
					Lorem Ipsum is simply dummy text of the printing and
					typesetting industry. Lorem Ipsum has been the industry's
					standard dummy text ever since the 1500s, when an unknown
					printer took a galley of type and scrambled it to make a
					type specimen book. It has survived not only five centuries,
					but also the leap into electronic typesetting, remaining
					essentially unchanged. It was popularised in the 1960s with
					the release of Letraset sheets containing Lorem Ipsum
					passages, and more recently with desktop publishing software
					like Aldus PageMaker including versions of Lorem Ipsum.
				</p>
			</Container>
			<AboutMe />
			<ContactInfo />
		</div>
	);
};

export default Home;
