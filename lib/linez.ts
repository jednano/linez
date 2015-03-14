import StringFinder = require('./StringFinder');

var lineEndingFinder: StringFinder;

function linez(text: string) {
	// ReSharper disable once RedundantQualifier
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

		private static boms = {
			'\u00EF\u00BB\u00BF': 'utf-8-bom',
			'\u00FE\u00FF': 'utf-16be',
			'\u00FF\u00FE\u0000\u0000': 'utf-32le',
			'\u00FF\u00FE': 'utf-16le',
			'\u0000\u0000\u00FE\u00FF': 'utf-32be'
		};

		private static charsets = {
			'utf-8-bom': '\u00EF\u00BB\u00BF',
			'utf-16be': '\u00FE\u00FF',
			'utf-32le': '\u00FF\u00FE\u0000\u0000',
			'utf-16le': '\u00FF\u00FE',
			'utf-32be': '\u0000\u0000\u00FE\u00FF'
		};

		private bom = '';

		private _charset = '';

		get charset() {
			return this._charset;
		}

		set charset(value: string) {
			this.bom = Document.charsets[value] || '';
			this._charset = value || '';
		}

		lines: Line[];

		constructor(lines?: Line[]) {
			this.lines = lines || [];
			this.detectCharset();
		}

		private detectCharset() {
			var firstLine = this.lines[0];
			if (!firstLine) {
				return;
			}
			var boms = Object.keys(Document.boms);
			for (var i = 0; i < boms.length; i++) {
				var bom = boms[i];
				if (firstLine.text.slice(0, bom.length) === bom) {
					this.charset = Document.boms[bom];
					firstLine.text = firstLine.text.substr(bom.length);
					break;
				}
			}
		}

		toString() {
			return this.bom + this.lines.map(line => {
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

	export function configure(options: Options) {
		if (!options) {
			throw new Error('No configuration options to configure');
		}
		/* istanbul ignore else */
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
