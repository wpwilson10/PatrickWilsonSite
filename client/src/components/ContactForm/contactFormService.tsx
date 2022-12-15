import axios from "axios";
import { IContactForm } from "./contactForm";

const baseUrl = "http://localhost:3030/contactForm";

const postContactForm = async (
	newContact: IContactForm
): Promise<IContactForm> => {
	const response = await axios.post(baseUrl, newContact);

	return response.data;
};

export default postContactForm;
