import { Nav, Navbar } from "react-bootstrap";
import { scroller } from "react-scroll";

/**
 * NavRight contains links and forms that will render on the right side a navigation bar
 *
 * @returns a react component for the right side of the NavBar
 */
const NavRight = () => {
	return (
		<Nav className="ms-auto">
			<Nav.Link href="#" as="span">
				<em>WPW NavRight</em>
			</Nav.Link>
		</Nav>
	);
};

/**
 * NavLeft contains links and forms that will render on the left side a navigation bar
 *
 * @returns a react component for the left side of the NavBar
 */
const NavLeft = () => {
	return (
		<Nav className="me-auto">
			<Nav.Link
				onClick={() =>
					scroller.scrollTo("home", {
						smooth: true,
						offset: -20,
						duration: 200,
					})
				}
			>
				Home
			</Nav.Link>
			<Nav.Link
				onClick={() =>
					scroller.scrollTo("about", {
						smooth: true,
						offset: -20,
						duration: 200,
					})
				}
			>
				About
			</Nav.Link>
			<Nav.Link
				onClick={() =>
					scroller.scrollTo("contact_info", {
						smooth: true,
						offset: -20,
						duration: 200,
					})
				}
			>
				Contact Info
			</Nav.Link>
			<Nav.Link
				onClick={() =>
					scroller.scrollTo("contact_form", {
						smooth: true,
						offset: -20,
						duration: 200,
					})
				}
			>
				Send Message
			</Nav.Link>
		</Nav>
	);
};

const NavBar = () => {
	return (
		<Navbar collapseOnSelect expand="lg" className="navbar" variant="dark">
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<NavLeft />
				<NavRight />
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavBar;
