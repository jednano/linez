import ILine = require('./ILine');


class Linez {

	private newlines = /\r?\n/g;

	public parse(text: string, newlines?: RegExp) {
		var lines: ILine[] = [];
		var lineNumber = 0;
		var lineOffset = 0;
		text.replace(newlines || this.newlines, (match, offset) => {
			lines.push({
				number: ++lineNumber,
				offset: lineOffset,
				text: text.substring(lineOffset, offset),
				newline: match
			});
			lineOffset = offset + match.length;
			return match;
		});
		return lines;
	}

}

export = Linez;
