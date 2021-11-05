import { useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

function App() {
	const [markup, setMarkup] = useState("# Markup online");
	const outputRef = useRef<HTMLDivElement>(null);

	if (outputRef.current != null) {
		outputRef.current.innerHTML = parseMarkup(markup);
	}

	// outputRef.current?.innerHTML = parseMarkup(markup);

	return (
		<>
			<Navbar />
			<aside id="cheatsheet">
				<h1>Cheatsheet</h1>
			</aside>
			<main>
				<textarea onChange={(e) => setMarkup(e.target.value)}># Markup online</textarea>
				<div ref={outputRef}>
					{/* {parseMarkup(markup)} */}
					<h1>Markup online</h1>
				</div>
			</main>
		</>
	);
}

const parseMarkup = (text: string) => {
	//Parse markup to html elements string
	let html = "";
	const lines = text.split("\n");

	for (let line of lines) {
		line.trim();
		switch (line[0]) {
			case "#":
				html += `<h1>${line.substr(1)}</h1>`;
				break;
			case "-":
				html += `<ul><li>${line.substr(1)}</li></ul>`;
				break;
			case ">":
				html += `<blockquote>${line.substr(1)}</blockquote>`;
				break;
		}
	}

	return html;
};

export default App;
