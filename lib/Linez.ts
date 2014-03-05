import ILine = require('./ILine');


class Linez {

	private newline = /\r?\n/g;

	public parse(text: string, newline?: RegExp) {
		var lines: ILine[] = [];
		var lineNumber = 0;
		var lineOffset = 0;
		text.replace(newline || this.newline, (match, offset) => {
			lines.push({
				number: ++lineNumber,
				offset: offset,
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
