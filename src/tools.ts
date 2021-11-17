/**
 * Function looks for asterisks symbols and then properly styles the text.
 * @param {string} string - A string to be formatted.
 * @return {string} A HTML string with properly bold and itallic text.
 */
export const boldify = (line: string): string => {
	if (line.includes("*")) {
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

				if (prefixes > 0 && suffixes > 0) {
					sentences.splice(sentencePosition - prefixes, suffixes + prefixes + 1);
				}

				switch (Math.min(prefixes, suffixes)) {
					case 0:
						return sentence;
					case 1:
						return `<em>${sentence}</em>`;

					case 2:
						return `<b>${sentence}</b>`;

					case 3:
					default:
						return `<b><em>${sentence}</em></b>`;
				}
			})
			.join("");
	}

	return line;
};

/**
 * Function upon finding the given character in the string separates it into two strings inside the array.
 * @param {string} string - A string to be devided.
 * @param {string} character - The character to be used to divide the string.
 * @return {string[]} An array of strings that separated upon the character.
 */
export const separateString = (string: string, character: string): string[] => {
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

	if (buffer.length > 0) {
		parts.push(buffer);
	}

	return parts;
};

/**
 * Function will escape a character by replacing it with is corresponding code and thus remove it from markdown syntax parsing and will just appear as text.
 * @param {string} string - A string to be escaped.
 * @param {boolean} [escapeAny=false] - If true will escape any escapable character without the need for a `\` symbol.
 * @return {string} A string with escaped characters.
 */
export const escapeCharacters = (string: string, escapeAny: boolean = false): string => {
	const getCharacter = (character: string): string => {
		switch (character) {
			case "*":
				return "&#42;";
			case ">":
				return "&#62;";
			case "\\":
				return "&#92;";
			case "`":
				return "&#96;";
			case "{":
				return "&#123;";
			case "}":
				return "&#125;";
			case "[":
				return "&#91;";
			case "]":
				return "&#93;";
			case "(":
				return "&#40;";
			case ")":
				return "&#41;";
			case "#":
				return "&#35;";
			case "-":
				return "&#45;";
			case "!":
				return "&#33;";
			default:
				return "";
		}
	};

	let stringBuffer = "";

	if (escapeAny || !string.includes("\\")) {
		return string;
	}

	for (let i = 0; i < string.length; i++) {
		if (string[i] === "\\" || escapeAny) {
			const char = getCharacter(string[i + 1]);
			if (char === "") {
				stringBuffer += string[i];
				continue;
			}

			stringBuffer += char;
			i++;
		} else {
			stringBuffer += string[i];
		}
	}

	return stringBuffer;
};
/**
 * Function upon finding a string surrounded by `` ` `` characters will style it as code in its own block and escape any escapable characters.
 * @param {string} string - A string to be styled.
 * @return {string} A string with formatted code blocks.
 */
export const escapeCode = (string: string): string => {
	if (string.includes("`")) {
		const sentences = separateString(string, "`");
		const realSentences = sentences.filter((sentence) => sentence.trim() !== "`");

		return realSentences
			.map((sentence) => {
				const sentencePosition = sentences.indexOf(sentence);
				let prefixes = 0;
				let suffixes = 0;

				//Go from the sentence to the beginning of the line and search for asterisks
				for (let i = sentencePosition - 1; i >= 0; i--) {
					const character = sentences[i].trim();

					if (character === "`") {
						prefixes++;
					} else {
						break;
					}
				}

				//Go from the sentence to the end of the line and search for asterisks
				for (let i = sentencePosition + 1; i < sentences.length; i++) {
					const character = sentences[i].trim();

					if (character === "`") {
						suffixes++;
					} else {
						break;
					}
				}

				if (prefixes > 0 && suffixes > 0) {
					sentences.splice(sentencePosition - prefixes, suffixes + prefixes + 1);
					return `<code>${escapeCharacters(sentence, true)}</code>`;
				}

				return sentence;
			})
			.join("");
	}

	return string;
};
