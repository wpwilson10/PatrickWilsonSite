import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

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
			<Nav.Link as={Link} to="/" href="#">
				Home
			</Nav.Link>
			<Nav.Link as={Link} to="/about" href="#about">
				About
			</Nav.Link>
			<Nav.Link as={Link} to="/contact" href="#contact">
				Contact
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
