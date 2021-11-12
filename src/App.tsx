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
	// let html: string[] = [];
	const lines = text.split("\n");

	// for (let line of lines) {
	return lines
		.map((line, index) => {
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
						return `<p>${line}</p>`;
					}

					return `<h${heading}>${line.substr(heading)}</h${heading}>`;
				case "-":
					return `<ul><li>${line.substr(1)}</li></ul>`;

				case ">":
					return `<blockquote>${line.substr(1)}</blockquote>`;
				case "_":
				case "*":
					if (
						(line.substr(0, 2) === "**" && line.substr(-2) === "**" && line.length > 4) ||
						(line.substr(0, 2) === "__" && line.substr(-2) === "__" && line.length > 4)
					) {
						console.log(line, line.substr(2, line.length - 4));
						return `<strong>${line.substr(2, line.length - 4)}</strong>`;
					}

					return `<p>${line}</p>`;
				default:
					return `<p>${line}</p>`;
			}
		})
		.join("\n");
};

export default App;
