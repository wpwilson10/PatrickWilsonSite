import "./App.css";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar/navbar";
import { Container } from "react-bootstrap";
import AboutMe from "./components/AboutMe/aboutme";
import ContactInfo from "./components/ContactInfo/contactInfo";

const Home = () => (
	<div>
		<h2>TKTL notes app</h2>
		<p>
			Lorem Ipsum is simply dummy text of the printing and typesetting
			industry. Lorem Ipsum has been the industry's standard dummy text
			ever since the 1500s, when an unknown printer took a galley of type
			and scrambled it to make a type specimen book. It has survived not
			only five centuries, but also the leap into electronic typesetting,
			remaining essentially unchanged. It was popularised in the 1960s
			with the release of Letraset sheets containing Lorem Ipsum passages,
			and more recently with desktop publishing software like Aldus
			PageMaker including versions of Lorem Ipsum.
		</p>
	</div>
);

const App = () => {
	// New routes need to be added to NavBar also
	// NavBar goes outside container to make it full size
	// Routes goes inside container so that later calls to components are inside the container
	return (
		<div className="site-container">
			<NavBar />
			<Container className="content-container mt-3">
				<Routes>
					<Route path="/contact" element={<ContactInfo />} />
					<Route path="/about" element={<AboutMe />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Container>
		</div>
	);
};

export default App;
