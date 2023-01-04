import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const linkStyle = {
	padding: 5,
	color: "white",
};

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
			<Nav.Link href="#" as="span">
				<Link style={linkStyle} to="/">
					Home
				</Link>
			</Nav.Link>
			<Nav.Link href="#" as="span">
				<Link style={linkStyle} to="/notes">
					Notes
				</Link>
				<Link style={linkStyle} to="/new">
					New Note
				</Link>
			</Nav.Link>
		</Nav>
	);
};

const NavBar = () => {
	return (
		<Navbar
			collapseOnSelect
			expand="lg"
			style={{ color: "white", background: "RebeccaPurple" }}
		>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<NavLeft />
				<NavRight />
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavBar;