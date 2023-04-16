import { FallbackProps } from "react-error-boundary";
import axios from "axios";

// Library recommended in official docs - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

/**
 *
 * @type {string}
 */
const baseUrl: string = process.env.ERROR_API!;

export interface IError {
	name: string;
	message: string;
	errorStack: string | undefined; // Non-standard property that should be supported by most browsers
	componentStack: string | undefined;
}

export const logError = (error: Error, info: { componentStack: string }) => {
	const err: IError = {
		name: error.name,
		message: error.message,
		errorStack: error.stack,
		componentStack: info.componentStack,
	};

	console.log("Error logger:" + err.message);
	axios.post(baseUrl, err);
};

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{error?.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
		</div>
	);
}
