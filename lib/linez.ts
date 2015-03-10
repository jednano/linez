import StringFinder = require('./StringFinder');

var lineEndingFinder: StringFinder;

function linez(text: string) {
	var lines: linez.Line[] = [];
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
	return new linez.Document(lines);
}

// ReSharper disable once InconsistentNaming
module linez {

	export class Document {
		lines: Line[];

		constructor(lines?: Line[]) {
			this.lines = lines || [];
		}

		toString() {
			if (!this.lines) {
				return '';
			}
			return this.lines.map(line => {
				return line.text + (line.ending || '');
			}).join('');
		}
	}

	export interface Line {
		offset: number;
		number: number;
		text: string;
		ending?: string;
	}

	export interface Options {
		newlines?: string[];
	}

	export function configure(options?: Options) {
		options = options || {};
		if (options.newlines) {
			lineEndingFinder = new StringFinder(options.newlines);
		}
	}

	export function resetConfiguration() {
		lineEndingFinder = new StringFinder(/\r?\n/g);
	}

}

linez.resetConfiguration();

export = linez;
