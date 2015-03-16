var iconv = require('iconv-lite');

import StringFinder = require('./StringFinder');

var lineEndingFinder: StringFinder;
iconv.extendNodeEncodings();

// ReSharper disable RedundantQualifier
function linez(contents: string): linez.Document;
function linez(buffer: Buffer): linez.Document;
function linez(file: string|Buffer): linez.Document {
	// ReSharper restore RedundantQualifier
	if (typeof file === 'string') {
		return new linez.Document(parseLines(file));
	}
	var buffer = <Buffer>file;
	var doc = new linez.Document();
	doc.charset = detectCharset(buffer);
	var bom = boms[doc.charset];
	switch (doc.charset) {
		case 'utf-8-bom':
		case 'utf-16le':
		case 'utf-16be':
			var encoding = doc.charset.replace(/bom$/, '');
			doc.lines = parseLines(buffer.slice(bom.length).toString(encoding));
			break;
		case 'utf-32le':
		case 'utf-32be':
			// TODO: Properly decode these charsets
			throw new Error('Decoding ' + doc.charset + ' charset not yet supported');
		default:
			doc.lines = parseLines(buffer.toString('utf8'));
			break;
	}
	return doc;
}

function detectCharset(buffer: Buffer) {
	var bomKeys = Object.keys(boms);
	for (var i = 0; i < bomKeys.length; i++) {
		var charset = bomKeys[i];
		var bom = boms[charset];
		if ((<any>buffer.slice(0, bom.length)).equals(bom)) {
			return charset;
		}
	}
	return '';
}

var boms: { [key: string]: Buffer } = {
	'utf-8-bom': new Buffer([0xef, 0xbb, 0xbf]),
	'utf-16be': new Buffer([0xfe, 0xff]),
	'utf-32le': new Buffer([0xff, 0xfe, 0x00, 0x00]),
	'utf-16le': new Buffer([0xff, 0xfe]),
	'utf-32be': new Buffer([0x00, 0x00, 0xfe, 0xff])
};

function parseLines(text: string) {
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
			text: text.substr(lineOffset),
			ending: ''
		});
	}
	return lines;
}

// ReSharper disable once InconsistentNaming
module linez {

	export class Document {

		get bom() {
			return boms[this.charset];
		}

		private _charset = '';

		get charset() {
			return this._charset;
		}

		set charset(value: string) {
			this._charset = value || '';
		}

		private contents: string;

		lines: Line[];

		constructor(lines?: Line[]) {
			this.lines = lines || [];
		}

		toString() {
			return this.lines.map(line => {
				return line.text + line.ending;
			}).join('');
		}
	}

	export interface Line {
		offset: number;
		number: number;
		text: string;
		ending: string;
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
