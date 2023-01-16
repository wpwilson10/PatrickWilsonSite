import { createRoot } from "react-dom/client";
import React from "react";

import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

// React 18
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>
);
