import { useRef, useState } from "react";

import Navbar from "./components/navbar";
import "./styles/App.css";
import "./styles/snippet.css";
import { boldify } from "./tools";

function App() {
	const [markdown, setMarkdown] = useState("# Welcome to Markdown online");
	const outputRef = useRef<HTMLDivElement>(null);

	if (outputRef.current != null) {
		outputRef.current.innerHTML = parseMarkdown(markdown);
	}

	const Snippet = ({ prefix, suffix = "", text }: SnippetProps) => {
		return (
			<div
				className="snippet"
				onClick={() => {
					setMarkdown(markdown + "\n" + prefix + text + suffix);
				}}
			>
				<span>{prefix}</span> {text} <span>{suffix}</span>
			</div>
		);
	};

	return (
		<>
			<Navbar />
			<aside id="cheatsheet">
				<h1>Cheatsheet</h1>
				<Snippet prefix="#" text="Header" />
				<Snippet prefix="-" text="List element" />
				<Snippet prefix=">" text="Block quote" />
				<Snippet prefix="**" suffix="**" text="Bold" />
			</aside>
			<main>
				<textarea onChange={(e) => setMarkdown(e.target.value)} lang="en-gb" value={markdown} autoFocus></textarea>
				<div ref={outputRef}>
					<h1>Welcome to Markdown online</h1>
				</div>
			</main>
		</>
	);
}

const parseMarkdown = (text: string): string => {
	//Parse markdown to html elements string
	const lines = text.split("\n");

	//[Is paragraph, was last line paragraph]
	// let isParagraph = [false, false];

	return lines
		.map((line, index) => {
			line = line.trimLeft();

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
					//Wrap in an anonymous function to prevent block scoped variable name issues
					return (() => {
						const preLineBrake = index - 1 >= 0 ? lines[index - 1][0] === ">" : true;
						const afterLineBrake = index + 1 < lines.length ? lines[index + 1][0] !== ">" : true;
						let paragraph = "";

						if (preLineBrake === false) {
							paragraph += "<blockquote>";
						} else {
							paragraph += "<br>";
						}

						paragraph += boldify(line.substr(1));

						if (afterLineBrake) {
							paragraph += "</blockquote>";
						}

						return paragraph;
					})();

				case "\n":
					return "";
				default:
					if (line.length === 0) return "";

					const lineBrake = index - 1 >= 0 ? lines[index - 1].substr(lines[index - 1].length - 2) === "  " : false;
					const preLineBrake = index - 1 >= 0 ? lines[index - 1] === "" : true;
					const afterLineBrake = index + 1 < lines.length ? lines[index + 1] === "" : true;
					let paragraph = "";

					if (lineBrake) {
						paragraph += "<br>";
					}

					if (preLineBrake) {
						paragraph += "<p>";
					}

					paragraph += boldify(line);

					if (afterLineBrake) {
						paragraph += "</p>";
					}

					return paragraph;
			}
		})
		.join("\n");
};

export default App;
