import { useState } from "react";
import { useAppDispatch } from "../../store";
import { createNote } from "./noteReducer";

const NoteForm = () => {
	const [newNote, setNewNote] = useState("");
	// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
	const dispatch = useAppDispatch();

	// Typing React Forms Events
	// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewNote(event.currentTarget.value);
	};

	const addNote = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		dispatch(createNote(newNote));
		setNewNote("");
	};

	return (
		<div>
			<h2>Create a new note</h2>
			<form onSubmit={addNote}>
				<input name="note" value={newNote} onChange={handleChange} />
				<button type="submit">save</button>
			</form>
		</div>
	);
};

export default NoteForm;
