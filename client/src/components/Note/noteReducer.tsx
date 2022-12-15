import {
	AnyAction,
	createSlice,
	PayloadAction,
	ThunkAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { NoteType } from "./note";
import noteService from "./noteService";

// Typescript + Redux wants an explicit state type and initialization for correct type inferrence
// https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
type NoteState = {
	notes: NoteType[];
};

const initialState: NoteState = {
	notes: [
		{
			content: "reducer defines how redux store works",
			important: true,
			id: 1,
		},
		{
			content: "state of store can contain any data",
			important: false,
			id: 2,
		},
	],
};

// https://redux.js.org/usage/usage-with-typescript#type-checking-redux-thunks
export const initializeNotes = (): ThunkAction<
	void,
	RootState,
	unknown,
	AnyAction
> => {
	return async (dispatch) => {
		try {
			const notes = await noteService.getAll();
			dispatch(setNotes(notes));
		} catch (error) {
			console.log(error);
		}
	};
};

const noteSlice = createSlice({
	name: "notes",
	initialState,
	reducers: {
		// don't use explicit returns unless needed
		toggleImportanceOf(state, action: PayloadAction<number>) {
			const id = action.payload;
			const noteToChange = state.notes.find((n) => n.id === id);
			if (typeof noteToChange?.important !== "undefined") {
				noteToChange.important = !noteToChange?.important;
			}
		},
		appendNote(state, action: PayloadAction<NoteType>) {
			console.log(action.payload);
			state.notes.push(action.payload);
		},
		setNotes(_state, action: PayloadAction<NoteType[]>) {
			return { notes: action.payload };
		},
	},
});

export const createNote = (
	content: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
	// create our new note object
	const note: NoteType = {
		id: 0,
		content: content,
		important: false,
	};
	// send to server, then add note with info from server to store
	return async (dispatch) => {
		try {
			const newNote = await noteService.create(note);
			dispatch(appendNote(newNote));
		} catch (error) {
			console.log(error);
		}
	};
};

export const selectNotes = (state: RootState) => {
	if (state.filter.filter === "ALL") {
		return state.notes.notes;
	}
	return state.filter.filter === "IMPORTANT"
		? state.notes.notes.filter((note) => note.important)
		: state.notes.notes.filter((note) => !note.important);
};

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions;
export default noteSlice.reducer;
