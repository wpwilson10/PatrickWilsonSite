/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { NoteType } from "./note";

const baseUrl = "http://localhost:3030/notes";

const getAll = async (): Promise<NoteType[]> => {
	const response = await axios.get(baseUrl);
	// do better data validation
	return response.data.notes;
};

const create = async (newObject: NoteType): Promise<NoteType> => {
	// user authentication for adding note
	const config = {
		headers: { Authorization: "WPW" },
	};

	const response = await axios.post(baseUrl, newObject, config);
	return response.data;
};

const update = async (id: number, newObject: NoteType) => {
	const response = await axios.put(`${baseUrl}/${id}`, newObject);
	return response.data;
};

export default {
	getAll,
	create,
	update,
};
