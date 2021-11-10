import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import PageRouter from "./router";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<PageRouter />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
