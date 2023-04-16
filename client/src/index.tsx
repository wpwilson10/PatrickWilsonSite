import { createRoot } from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { logError } from "./utils/Error/error";

// React 18
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

try {
	root.render(
		<React.StrictMode>
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</React.StrictMode>
	);
} catch (e: unknown) {
	if (e instanceof Error) {
		logError(e, { componentStack: "root" });
		root.render(
			<div role="alert">
				<p>Something went wrong:</p>
				<pre>{e?.message}</pre>
			</div>
		);
	} else {
		root.render(
			<div role="alert">
				<p>Something went wrong. Please try again</p>
			</div>
		);
	}
}
