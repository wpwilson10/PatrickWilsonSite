import { createRoot } from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
import { store } from "./store";

// React 18
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>
	</React.StrictMode>
);
