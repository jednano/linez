import ILine = require('./ILine');
import StringFinder = require('./StringFinder');


class Linez {

	private lineEndingFinder: StringFinder;

	constructor() {
		this.lineEndingFinder = new StringFinder(/\r?\n/g);
	}

	set newlines(newlines: string[]) {
		this.lineEndingFinder = new StringFinder(newlines);
	}

	parse(text: string) {
		var lines: ILine[] = [];
		var lineNumber = 1;
		var lineOffset = 0;
		this.lineEndingFinder.findAll(text).forEach(lineEnding => {
			lines.push({
				number: lineNumber++,
				offset: lineOffset,
				text: text.substring(lineOffset, lineEnding.index),
				ending: lineEnding.text
			});
			lineOffset = lineEnding.index + lineEnding.text.length;
		});
		if (lineOffset < text.length || text === '') {
			lines.push({
				number: lineNumber,
				offset: lineOffset,
				text: text.substr(lineOffset)
			});
		}
		return lines;
	}

}

export = Linez;
