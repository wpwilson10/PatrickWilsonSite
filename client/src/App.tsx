import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar/navbar";
import { Container } from "react-bootstrap";
import { lazy, Suspense, useEffect } from "react";
import { useAppDispatch } from "./store";
import { setIsOpen } from "./components/ShoppingCart/shoppingCartReducer";

const Home = lazy(() => import("./components/Home/home"));
const ContactPage = lazy(() => import("./components/ContactInfo/contactInfo"));
const Shop = lazy(() => import("./components/Shop/shop"));
const ShoppingCart = lazy(
	() => import("./components/ShoppingCart/shoppingCart")
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
				<Suspense fallback={<div>Loading</div>}>
					<Routes>
						<Route path="/contact" element={<ContactPage />} />
						<Route path="/shop" element={<Shop />} />
						<Route path="/" element={<Home />} />
					</Routes>
				</Suspense>
			</Container>
			{/* Shopping Cart that shows selected products in sidebar */}
			<Suspense fallback={<div>Loading</div>}>
				<ShoppingCart></ShoppingCart>
			</Suspense>
		</Container>
	);
};

export default App;
