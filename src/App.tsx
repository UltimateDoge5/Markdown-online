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
	const lineCounter = useRef<HTMLDivElement>(null);

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

	console.log(calculateHeight(document.querySelector("textarea") as HTMLTextAreaElement));

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
				<div id="textarea">
					<div id="lineCounter" className={darkMode ? "dark" : "light"} ref={lineCounter}>
						{console.log(markdown.split("\n").length)}
						{markdown.split("\n").map((line, index) => {
							return <span key={index}>{index + 1}</span>;
						})}
					</div>
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
							setMarkerOffset({
								position: textarea.value.substring(0, textarea.selectionStart).split("\n").length - 1
							});
							setMarkdown(textarea.value);
						}}
						onInput={(e) => {
							const textarea = e.target as HTMLTextAreaElement;
							setMarkerOffset({
								position: textarea.value.substring(0, textarea.selectionStart).split("\n").length - 1
							});
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
						onScroll={(e) => {
							(lineCounter.current as HTMLDivElement).scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
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

var calculateContentHeight = function (textArea: HTMLTextAreaElement, scanAmount = 24): number {
	var origHeight = textArea.style.height,
		height = textArea.offsetHeight,
		scrollHeight = textArea.scrollHeight,
		overflow = textArea.style.overflow;
	/// only bother if the ta is bigger than content
	if (height >= scrollHeight) {
		/// check that our browser supports changing dimension
		/// calculations mid-way through a function call...
		textArea.style.height = height + scanAmount + "px";
		/// because the scrollbar can cause calculation problems
		textArea.style.overflow = "hidden";
		/// by checking that scrollHeight has updated
		if (scrollHeight < textArea.scrollHeight) {
			/// now try and scan the ta's height downwards
			/// until scrollHeight becomes larger than height
			while (textArea.offsetHeight >= textArea.scrollHeight) {
				textArea.style.height = (height -= scanAmount) + "px";
			}
			/// be more specific to get the exact height
			while (textArea.offsetHeight < textArea.scrollHeight) {
				textArea.style.height = height++ + "px";
			}
			/// reset the ta back to it's original height
			textArea.style.height = origHeight;
			/// put the overflow back
			textArea.style.overflow = overflow;
			return height;
		}
	}
	return scrollHeight;
};

var calculateHeight = function (textArea: HTMLTextAreaElement) {
	const style = window.getComputedStyle ? window.getComputedStyle(textArea) : textArea.style;
	// This will get the line-height only if it is set in the css,
	// otherwise it's "normal"
	const taLineHeight = parseInt(style.lineHeight, 10);
	// Get the scroll height of the textarea
	const taHeight = calculateContentHeight(textArea, taLineHeight);
	// calculate the number of lines
	const numberOfLines = Math.ceil(taHeight / taLineHeight);

	return "there are " + numberOfLines + " lines in the text area";
};

export default App;
