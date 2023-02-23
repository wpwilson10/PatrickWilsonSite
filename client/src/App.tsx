import { Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar/navbar";
import { Container } from "react-bootstrap";
import AboutMe from "./components/AboutMe/aboutme";
import ContactInfo from "./components/ContactInfo/contactInfo";
import ContactFormRecaptcha from "./components/ContactForm/contactFormRecaptcha";
import Shop from "./components/Shop/shop";
import { useEffect } from "react";
import { scroller } from "react-scroll";

const Home = () => {
	// scrolling based on https://stackoverflow.com/questions/61779236/how-to-navigate-to-another-page-with-a-smooth-scroll-on-a-specific-id-with-react
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
				<h2>TKTL notes app</h2>
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

const ContactPage = () => (
	<div>
		<ContactInfo />
		<ContactFormRecaptcha />
	</div>
);

const App = () => {
	// New routes need to be added to NavBar also
	// NavBar goes outside container to make it full size
	// Routes goes inside container so that later calls to components are inside the container
	return (
		<div className="body-container">
			<NavBar />
			<Container className="site-container mt-3">
				<Routes>
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/shop" element={<Shop />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Container>
		</div>
	);
};

export default App;
