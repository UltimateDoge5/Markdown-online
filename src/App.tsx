import { useRef, useState } from "react";

import Navbar from "./components/navbar";
import "./styles/App.css";
import "./styles/snippet.css";

function App() {
	const [markdown, setMarkdown] = useState("# Welcome to Markdown online");
	const outputRef = useRef<HTMLDivElement>(null);

	if (outputRef.current != null) {
		outputRef.current.innerHTML = parseMarkup(markdown);
	}

	const Snippet = ({ symbol, text }: SnippetProps) => {
		return (
			<div
				className="snippet"
				onClick={() => {
					setMarkdown(markdown + "\n" + symbol + text);
				}}
			>
				<b>{symbol}</b> {text}
			</div>
		);
	};

	return (
		<>
			<Navbar />
			<aside id="cheatsheet">
				<h1>Cheatsheet</h1>
				<Snippet symbol="#" text="Header" />
				<Snippet symbol="-" text="List element" />
				<Snippet symbol=">" text="Block quote" />
			</aside>
			<main>
				<textarea onChange={(e) => setMarkdown(e.target.value)} value={markdown} defaultValue="# Welcome to Markdown online"></textarea>
				<div ref={outputRef}>
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
			default:
				html += `<p>${line}</p>`;
				break;
		}
	}

	return html;
};

export default App;
