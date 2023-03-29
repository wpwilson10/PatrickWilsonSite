import { Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar/navbar";
import { Container } from "react-bootstrap";
import AboutMe from "./components/AboutMe/aboutme";
import ContactInfo from "./components/ContactInfo/contactInfo";
import ContactFormRecaptcha from "./components/ContactForm/contactFormRecaptcha";
import Shop from "./components/Shop/shop";
import { useEffect } from "react";
import { scroller } from "react-scroll";
import { ShoppingCart } from "./components/ShoppingCart/shoppingCart";
import { useAppDispatch } from "./store";
import { setIsOpen } from "./components/ShoppingCart/shoppingCartReducer";

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

const ContactPage = () => (
	<div>
		<ContactInfo />
		<ContactFormRecaptcha />
	</div>
);

/**
 * The main application component that renders the navigation bar and routes.
 * @function
 * @returns {JSX.Element} The rendered application component.
 *
 * @description
 * This component renders a container with a navigation bar (NavBar) and a set of routes.
 * The NavBar component should be updated to include any new routes added to the application.
 * The NavBar component goes outside the container to make it full size, while the Routes
 * component goes inside the container to ensure that later calls to components are also
 * inside the container.
 */
const App = () => {
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();
	// always close shopping cart sidebar when loading site
	useEffect(() => {
		dispatch(setIsOpen(false));
	}, [dispatch]);

	return (
		<Container fluid className="px-1 py-3 body-container">
			<NavBar />
			<Container className="px-1 site-container">
				<Routes>
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/shop" element={<Shop />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Container>
			{/* Shopping Cart that shows selected products in sidebar */}
			<ShoppingCart></ShoppingCart>
		</Container>
	);
};

export default App;
