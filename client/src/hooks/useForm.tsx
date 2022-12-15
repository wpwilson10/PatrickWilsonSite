import { useState } from "react";

// Copied from https://upmostly.com/tutorials/using-custom-react-hooks-simplify-forms

/**
 * This is not totally correct or in use
 * @param callback a function
 * @returns
 */
const useForm = (callback: () => void) => {
	const [values, setValues] = useState({});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		if (event) event.preventDefault();
		callback();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.persist();
		setValues((values) => ({
			...values,
			[event.target.name]: event.target.value,
		}));
	};

	return {
		handleChange,
		handleSubmit,
		values,
	};
};

export default useForm;
