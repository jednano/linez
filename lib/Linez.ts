import ILine = require('./ILine');


class Linez {

	private _newlinesExpression = /\r?\n/g;

	public set newlines(newlines: string[]) {
		this._newlinesExpression = this.convertToPipedExpression(newlines);
	}

	private convertToPipedExpression(newlines: string[]) {
		newlines = newlines.map(s => {
			return '\\' + s.split('').join('\\');
		});
		var result = new RegExp('(?:' + newlines.join('|') + ')', 'g');
		return result;
	}

	parse(text: string) {
		var lines: ILine[] = [];
		var lineNumber = 1;
		var lineOffset = 0;
		text.replace(this._newlinesExpression, (match, offset) => {
			lines.push({
				number: lineNumber++,
				offset: lineOffset,
				text: text.substring(lineOffset, offset),
				ending: match
			});
			lineOffset = offset + match.length;
			return match;
		});
		if (lineOffset !== text.length || text === '') {
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
