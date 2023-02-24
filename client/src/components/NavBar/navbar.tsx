import { Container, Nav, Navbar } from "react-bootstrap";

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
 * NavLeft contains links and forms that will render on the left side a navigation bar.
 * Link offset is -100 for first section and -70 after to compensate for top fixed toolbar.
 * Duration 200 was considered a fast speed for major screen changes by some study.
 * eventKey="#" makes collapseOnSelect work - https://stackoverflow.com/a/56485081
 *
 * @returns a react component for the left side of the NavBar
 */
const NavLeft = () => {
	return (
		<Nav className="me-auto">
			<Nav.Link eventKey="1" href="/#home">
				Home
			</Nav.Link>
			<Nav.Link eventKey="2" href="/#about">
				About
			</Nav.Link>
			<Nav.Link eventKey="3" href="/#contact_info">
				Contact Info
			</Nav.Link>
			<Nav.Link eventKey="4" href="/contact">
				Send Message
			</Nav.Link>
			<Nav.Link href="/shop">Shop</Nav.Link>
		</Nav>
	);
};

const NavBar = () => {
	return (
		<Navbar
			collapseOnSelect={true}
			expand="lg"
			className="navbar"
			variant="dark"
			fixed="top"
		>
			<Container fluid>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<NavLeft />
					<NavRight />
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavBar;
