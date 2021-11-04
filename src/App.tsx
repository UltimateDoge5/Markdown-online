import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

function App() {
	const [markup, setMarkup] = useState("# Markup online");

	return (
		<>
			<Navbar />
			<aside id="cheatsheet"></aside>
			<main>
				<textarea onChange={(e) => setMarkup(e.target.value)}># Markup online</textarea>
				<div>
					{markup}
					<h1>Markup online</h1>
				</div>
			</main>
		</>
	);
}

export default App;
