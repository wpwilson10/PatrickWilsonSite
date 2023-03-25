import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import {
	selectCartTotalQuantity,
	setIsOpen,
} from "../ShoppingCart/shoppingCartReducer";

/**
 * NavRight displays a shopping cart icon with the number of items in the cart
 * which will render on the right side a navigation bar
 *
 * @returns {JSX.Element} a react component for the right side of the NavBar
 */
const NavRight = () => {
	const quantity = useSelector(selectCartTotalQuantity);
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	const openCart = () => {
		dispatch(setIsOpen(true));
	};

	if (quantity > 0) {
		return (
			<Nav className="ms-auto" onSelect={openCart}>
				<Nav.Link href="#" eventKey="cart" as="span">
					<FaShoppingCart size="1.5em" />{" "}
					<Badge bg="primary">{quantity}</Badge>
				</Nav.Link>
			</Nav>
		);
	} else {
		return (
			<Nav className="ms-auto">
				<Nav.Link href="#" eventKey="cart" as="span">
					<FaShoppingCart size="1.5em" />{" "}
				</Nav.Link>
			</Nav>
		);
	}
};

/**
 * NavLeft contains links that will render on the left side a navigation bar.
 * eventKey="#" makes collapseOnSelect work - https://stackoverflow.com/a/56485081
 *
 * @returns {JSX.Element} a react component for the left side of the NavBar
 */
const NavLeft = () => {
	return (
		<Nav className="me-auto">
			<Nav.Link eventKey="home" href="/#home">
				Home
			</Nav.Link>
			<Nav.Link eventKey="about" href="/#about">
				About
			</Nav.Link>
			<Nav.Link eventKey="contact" href="/contact">
				Contact
			</Nav.Link>
			<Nav.Link eventKey="shop" href="/shop">
				Shop
			</Nav.Link>
		</Nav>
	);
};

/**
 * NavBar is the main navigation bar component for the website and
 * contains two components for the left and right side of the navigation bar.
 * It also has properties for collapsing on select, expanding to large viewports,
 * using a dark variant, and being fixed to the top of the viewport.
 *
 * @returns {JSX.Element} a react component for the NavBar
 */
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
				</Navbar.Collapse>
				<NavRight />
			</Container>
		</Navbar>
	);
};

export default NavBar;
