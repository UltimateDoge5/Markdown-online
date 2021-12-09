import { useEffect, useRef, useState } from "react";

import Navbar from "./components/navbar";
import { boldify, escapeCharacters, escapeCodeBlocks } from "./tools";
import "./styles/App.css";
import Toggle from "./components/toggle";

const App = () => {
	const [markdown, setMarkdown] = useState("");
	const [markerOffset, setMarkerOffset] = useState({ position: 0 });
	const [darkMode, setDarkMode] = useState(fetchDarkModePrefference());
	const outputRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMarkdown(
			"# Welcome to Markdown online!\n\nMarkdown online is my implementation of a markdown parser\n\n## List of currently supported features\n- Headings\n- Paragraphs\n- Unordered lists\n- Blockquotes\n- *Italics*, **bolds** and ***Both combined***\n- `Code blocks`\n- Character escaping"
		);

		window.matchMedia("prefers-color-scheme: dark").addEventListener("change", (e) => {
			if (localStorage.getItem("darkMode") === "true") {
				setDarkMode(true);
			} else {
				setDarkMode(e.matches);
			}
		});

		return () => {
			window.matchMedia("prefers-color-scheme: dark").removeEventListener("change", (e) => {
				if (localStorage.getItem("darkMode") === "true") {
					setDarkMode(true);
				} else {
					setDarkMode(e.matches);
				}
			});
		};
	}, []);

	if (outputRef.current != null) {
		outputRef.current.innerHTML = parseMarkdown(markdown);
	}

	return (
		<>
			<Navbar />
			<div className={darkMode ? "dark" : "light"}>
				<Toggle
					label="Dark mode"
					state={darkMode}
					onChange={(enabled) => {
						setDarkMode(enabled);
						localStorage.setItem("darkMode", enabled.toString());
					}}
				/>
			</div>
			<main className={darkMode ? "dark" : "light"}>
				<div className="textarea">
					<div
						id="lineMarker"
						style={{
							transform: `translateY(${markerOffset.position * 24}px)`
						}}
					></div>
					<textarea
						wrap="on"
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
						onKeyUp={(e) => {
							const textarea = e.target as HTMLTextAreaElement;
							setMarkerOffset({
								position: textarea.value.substring(0, textarea.selectionStart).split("\n").length - 1
							});
						}}
						onChange={(e) => {
							setMarkdown(e.target.value);
						}}
						onClick={(e) => {
							const textarea = e.target as HTMLTextAreaElement;
							setMarkerOffset({
								position: textarea.value.substring(0, textarea.selectionStart).split("\n").length - 1
							});
						}}
						value={markdown}
						autoFocus
					></textarea>
				</div>

				<div id="render" ref={outputRef}></div>
			</main>
		</>
	);
};

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

const fetchDarkModePrefference = () => {
	if (localStorage.getItem("darkMode") === "true") {
		return true;
	} else {
		return window.matchMedia("prefers-color-scheme: dark").matches;
	}
};

export default App;
