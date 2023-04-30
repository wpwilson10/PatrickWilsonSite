import { FallbackProps } from "react-error-boundary";
import axios from "axios";

/**
 *
 * @type {string}
 */
const baseUrl: string = process.env.ERROR_API!;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
export interface IError {
	name: string;
	message: string;
	stack: string | undefined; // Non-standard property that should be supported by most browsers
	componentStack: string | undefined; // Used by react error boundary
}

export const logErrorBoundary = (
	error: Error,
	info: { componentStack: string }
) => {
	const err: IError = {
		name: error.name,
		message: error.message,
		stack: error?.stack,
		componentStack: info.componentStack,
	};

	console.error("Error logger:" + err.message);
	axios.post(baseUrl, err);
};

export const logErrorToServer = (error: any, info: string) => {
	let err: IError = {
		name: "Unknown error",
		message: "logErrorToServer: ".concat(info),
		stack: error?.stack,
		componentStack: undefined,
	};

	// if this is a real error type, add the additional info
	if (error instanceof Error) {
		err.name = error.name;
		err.message = err.message.concat(" : ", error?.message);
	}

	try {
		axios.post(baseUrl, err);
	} catch (error) {
		handleAxiosError(error);
	}

	console.error(err.message);
};

// Library recommended in official docs - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{error?.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}

export function handleAxiosError(error: any) {
	// https://axios-http.com/docs/handling_errors
	if (axios.isAxiosError(error)) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.warn(error.response.data);
			console.warn(error.response.status);
			console.warn(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			console.warn(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			logErrorToServer(error, "handleAxiosError");
			console.error("Error", error.message);
		}
	}
}
