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
	const lines = text.split("\n");

	return lines
		.map((line, index) => {
			line = line.trim();

			if (line.includes("*")) {
				const separateString = (string: string, character: string) => {
					let parts = [];
					let buffer = "";
					for (let char of string) {
						if (char !== character) {
							buffer += char;
						} else {
							if (buffer.length > 0) {
								parts.push(buffer);
							}

							parts.push(character);
							buffer = "";
						}
					}
					return parts;
				};

				const sentences = separateString(line, "*");
				const realSentences = sentences.filter((sentence) => sentence.trim() !== "*");

				return realSentences
					.map((sentence) => {
						const sentencePosition = sentences.indexOf(sentence);
						let prefixes = 0;
						let suffixes = 0;

						//Go from the sentence to the beginning of the line and search for asterisks
						for (let i = sentencePosition - 1; i >= 0; i--) {
							const character = sentences[i].trim();

							if (character === "*") {
								prefixes++;
							} else {
								break;
							}
						}

						//Go from the sentence to the end of the line and search for asterisks
						for (let i = sentencePosition + 1; i < sentences.length; i++) {
							const character = sentences[i].trim();

							if (character === "*") {
								suffixes++;
							} else {
								break;
							}
						}

						if (prefixes !== 0 && suffixes !== 0) {
							sentences.splice(sentencePosition - prefixes, suffixes + prefixes + 1);
						}

						switch (Math.min(prefixes, suffixes)) {
							case 0:
								return sentence;
							case 1:
								return `<i>${sentence}</i>`;

							case 2:
								return `<b>${sentence}</b>`;

							case 3:
							default:
								return `<b><i>${sentence}</i></b>`;
						}
					})
					.join("");
			}

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
				default:
					// if (index - 1 > 0 && lines[index - 1] === "\n") {
					return `<p>${line}</p>`;
				// } else if ("") {
				// }
			}
		})
		.join("\n");
};

export default App;
