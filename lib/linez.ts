import _ILine = require('./ILine');
import _IOptions = require('./IOptions');
import _Document = require('./Document');
import StringFinder = require('./StringFinder');


var lineEndingFinder = new StringFinder(/\r?\n/g);

module linez {

	// ReSharper disable once DuplicatingLocalDeclaration
	export var Document = _Document;

	export interface ILine extends _ILine {
	}

	export interface IOptions extends _IOptions {
	}

	export function configure(options?: IOptions) {
		options = options || {};
		if (options.newlines) {
			lineEndingFinder = new StringFinder(options.newlines);
		}
	}

	export function parse(text: string) {
		var lines: ILine[] = [];
		var lineNumber = 1;
		var lineOffset = 0;
		lineEndingFinder.findAll(text).forEach(lineEnding => {
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
		return new Document(lines);
	}

}

export = linez;
