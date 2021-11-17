import { useRef, useState } from "react";

import Navbar from "./components/navbar";
import "./styles/App.css";
import "./styles/snippet.css";
import { boldify, escapeCharacters, escapeCodeBlocks } from "./tools";

function App() {
	const [markdown, setMarkdown] = useState(
		`# Welcome to Markdown online!\n\nMarkdown online is my implemantation of a markdown parser\n\n##List of currently supported features\n- Headings\n- Paragraphs\n- Unordered lists\n- Block quotes\n- Itallics, bolds and Both combined\n- Code blocks\n- Character escaping `
	);
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
				<span>
					<span>{prefix}</span> {text} <span>{suffix}</span>
				</span>
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
				<Snippet prefix="`" suffix="`" text="Code" />
			</aside>
			<main>
				<textarea
					wrap="off"
					onKeyDown={(e) => {
						const textarea = e.target as HTMLTextAreaElement;
						switch (e.key) {
							case "Tab":
								e.preventDefault();
								textarea.value =
									textarea.value.substring(0, textarea.selectionStart) +
									"    " +
									textarea.value.substring(textarea.selectionStart, textarea.value.length);
								textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart + "    ".length;
								break;
							case "Backspace":
								if (textarea.value.substring(textarea.selectionStart - 4, textarea.selectionStart) === "    ") {
									textarea.value =
										textarea.value.substring(0, textarea.selectionStart - 3) +
										textarea.value.substring(textarea.selectionStart, textarea.value.length);
									textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart - 3;
								}
								break;
							case "LeftArrow":
								if (textarea.value.substring(textarea.selectionStart - 4, textarea.selectionStart) === "    ") {
									textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart - 3;
								}
								break;
							case "RightArrow":
								if (textarea.value.substring(textarea.selectionStart + 4, textarea.selectionStart) === "    ") {
									textarea.selectionStart = textarea.selectionEnd = textarea.selectionStart + 3;
								}
								break;
						}

						setMarkdown(textarea.value);
					}}
					onChange={(e) => {
						setMarkdown(e.target.value);
					}}
					value={markdown}
					autoFocus
				></textarea>
				<div ref={outputRef}>
					<h1> Welcome to Markdown online!</h1>

					<p>Markdown online is my implemantation of a markdown parser.</p>

					<h2> List of currently supported features</h2>
					<ul>
						<li> Headings</li>
						<li> Paragraphs</li>
						<li> Unorders lists</li>
						<li> Block quotes</li>
						<li>
							<em>Itallics</em>, <b>bolds</b> and{" "}
							<b>
								<em>Both combined</em>
							</b>
						</li>
						<li> Code blocks</li>
						<li> Character escaping </li>
					</ul>
				</div>
			</main>
		</>
	);
}

const parseMarkdown = (text: string): string => {
	//Parse markdown to html elements string
	const lines = text.split("\n");

	return lines
		.map((line, index) => {
			line = escapeCharacters(line.trimLeft());
			line = escapeCodeBlocks(line);
			line = boldify(line);

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
					//Wrap in an anonymous function to prevent block scoped variable name issues
					if (line[1] !== " ") return line;

					return (() => {
						const preLineBrake = index - 1 >= 0 ? lines[index - 1][0] === "-" : true;
						const afterLineBrake = index + 1 < lines.length ? lines[index + 1][0] !== "-" : true;
						let listElement = "";

						if (preLineBrake === false) {
							listElement += "<ul>";
						}

						listElement += `<li>${line.substr(1)}</li>`;

						if (afterLineBrake) {
							listElement += "</ul>";
						}

						return listElement;
					})();
				case ">":
					//Wrap in an anonymous function to prevent block scoped variable name issues
					return (() => {
						//TODO: Add support for nested block quotes
						const preLineBrake = index - 1 >= 0 ? lines[index - 1][0] === ">" : true;
						const afterLineBrake = index + 1 < lines.length ? lines[index + 1][0] !== ">" : true;
						let blockquote = "";

						if (preLineBrake === false) {
							blockquote += "<blockquote>";
						} else {
							blockquote += "<br>";
						}

						blockquote += line.substr(1);

						if (afterLineBrake) {
							blockquote += "</blockquote>";
						}

						return blockquote;
					})();
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

					paragraph += line;

					if (afterLineBrake) {
						paragraph += "</p>";
					}

					return paragraph;
			}
		})
		.join("\n");
};

export default App;
