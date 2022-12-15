import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import VisibilityFilter from "../VisibilityFilter/filter";
import { selectNotes, toggleImportanceOf } from "./noteReducer";

export interface NoteType {
	id: number;
	content: string;
	important: boolean;
}

const NoteTable = () => {
	const dispatch = useAppDispatch();
	const notes = useSelector(selectNotes);

	return (
		<Table striped>
			<tbody>
				{notes.map((note) => (
					<tr key={note.id}>
						<td>{note.id}</td>
						<td>{note.content}</td>
						<td>
							<button
								onClick={() =>
									dispatch(toggleImportanceOf(note.id))
								}
							>
								{note.important
									? "make not important"
									: "make important"}
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

const Notes = () => {
	return (
		<div>
			<h2>Notes</h2>
			<VisibilityFilter />
			<NoteTable />
		</div>
	);
};

export default Notes;
