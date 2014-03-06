import ILine = require('./ILine');

class StringFinder {

	private _newlinesExpression;

	constructor(newlines: string[]) {
		this._newlinesExpression = this.convertToPipedExpression(newlines);
	}

	private convertToPipedExpression(newlines: string[]) {
		newlines = newlines.map(s => {
			return '\\' + s.split('').join('\\');
		});
		var result = new RegExp('(?:' + newlines.join('|') + ')', 'g');
		return result;
	}

	public findAll(text) {
		var matches = [];
		var match;
		while(match = this._newlinesExpression.exec(text)) {
			matches.push({
				index: match.index,
				text: match[0]
			});
		}
		return matches;
	}
}


class Linez {

	private lineEndingFinder: StringFinder;

	constructor() {
		this.lineEndingFinder = new StringFinder(['\r\n', '\n']);
	}

	public set newlines(newlines: string[]) {
		this.lineEndingFinder = new StringFinder(newlines);
	}

	parse(text: string) {
		var lines: ILine[] = [];
		var lineNumber = 1;
		var lineOffset = 0;
		this.lineEndingFinder.findAll(text).forEach(function(lineEnding) {
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
