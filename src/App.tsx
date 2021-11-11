import { useRef, useState } from "react";

import Navbar from "./components/navbar";
import "./styles/App.css";
import "./styles/snippet.css";

function App() {
	const [markdown, setMarkdown] = useState("# Welcome to Markdown online");
	const outputRef = useRef<HTMLDivElement>(null);

	if (outputRef.current != null) {
		outputRef.current.innerHTML = parseMarkdown(markdown);
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
				<textarea onChange={(e) => setMarkdown(e.target.value)} value={markdown}></textarea>
				<div ref={outputRef}>
					<h1>Markup online</h1>
				</div>
			</main>
		</>
	);
}

const parseMarkdown = (text: string) => {
	//Parse markdown to html elements string
	let html = "";
	const lines = text.split("\n");

	for (let line of lines) {
		line = line.trim();

		switch (line[0]) {
			case "#":
				let heading = 0;

				for (let i = 0; i < line.length; i++) {
					if (line[i] === "#" && heading < 6) {
						heading++;
					} else {
						break;
					}
				}

				if (line[heading] !== " ") {
					html += `<p>${line}</p>`;
					break;
				}

				html += `<h${heading}>${line.substr(heading)}</h${heading}>`;
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
