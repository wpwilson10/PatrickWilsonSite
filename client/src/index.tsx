import { createRoot } from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { logErrorToServer } from "./utils/error";

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
} catch (e) {
	logErrorToServer(e, "Index rendering root");
	if (e instanceof Error) {
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
