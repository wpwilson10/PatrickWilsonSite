import "./App.css";
import { useEffect } from "react";

import { useAppDispatch } from "./store";
import { initializeNotes } from "./components/Note/noteReducer";
import { Route, Routes } from "react-router-dom";
import { Counter } from "./components/Counter/counter";
import NoteForm from "./components/Note/noteForm";
import NavBar from "./components/NavBar/navbar";
import Notes from "./components/Note/note";
import { Container, Row } from "react-bootstrap";
import ContactForm from "./components/ContactForm/contactForm";

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
	// useAppDispatch to make typescript happy with thunks
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// get notes
	useEffect(() => {
		dispatch(initializeNotes());
	}, [dispatch]);

	// New routes need to be added to NavBar also
	// NavBar goes outside container to make it full size
	// Routes goes inside container so that later calls to components are inside the container
	return (
		<div className="site-container">
			<NavBar />
			<Container className="content-container">
				<Row xs={1} md={1} xl={2}>
					<ContactForm></ContactForm>
					<ContactForm></ContactForm>
				</Row>
				<ContactForm></ContactForm>
				<Routes>
					<Route path="/counter" element={<Counter />} />
					<Route path="/new" element={<NoteForm />} />
					<Route path="/notes" element={<Notes />} />
					<Route path="/" element={<Home />} />
				</Routes>
			</Container>
		</div>
	);
};

export default App;
