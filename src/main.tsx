import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import App from "./App";
import "./index.css";
import PageRouter from "./Router";
// import Router from "./Router";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<PageRouter />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
