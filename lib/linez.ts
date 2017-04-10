import * as iconv from 'iconv-lite';
import * as bufferEquals from 'buffer-equals';
import WeakMap = require('es6-weak-map');
import some = require('lodash.some');
import StringFinder from './StringFinder';
var objectAssign = require('object-assign');

var boms: { [key: string]: Buffer } = {
	'utf-8-bom': new Buffer([0xef, 0xbb, 0xbf]),
	'utf-16be': new Buffer([0xfe, 0xff]),
	'utf-32le': new Buffer([0xff, 0xfe, 0x00, 0x00]),
	'utf-16le': new Buffer([0xff, 0xfe]),
	'utf-32be': new Buffer([0x00, 0x00, 0xfe, 0xff])
};

var globalOptions: linez.Options;
var lineEndingFinderCache = new WeakMap();

function linez(contents: string, options?: linez.Options): linez.Document;
function linez(buffer: Buffer, options?: linez.Options): linez.Document;
function linez(file: string|Buffer, options?: linez.Options): linez.Document {
	options = objectAssign({}, globalOptions, options);
	if (typeof file === 'string') {
		return new linez.Document(parseLines(file, options));
	}
	var buffer = <Buffer>file;
	var doc = new linez.Document();
	doc.charset = detectCharset(buffer);
	var bom = boms[doc.charset];
	var encoding = doc.charset.replace(/bom$/, '');
	if (iconv.encodingExists(encoding)) {
		doc.lines = parseLines(iconv.decode(buffer.slice(bom.length), encoding), options);
	} else {
		doc.lines = parseLines(buffer.toString('utf8'), options);
	}
	return doc;
}

function detectCharset(buffer: Buffer) {
	var detectCharset;
	some(boms, (bom, charset) => {
		if (bufferEquals(buffer.slice(0, bom.length), bom)) {
			detectCharset = charset;
			return charset;
		}
	});
	return detectCharset || '';
}

function parseLines(text: string, options: linez.Options) {
	var lines: linez.Line[] = [];
	var lineNumber = 1;
	var lineOffset = 0;
	var lineEndingFinder = lineEndingFinderCache.get(options.newlines);
	if (!lineEndingFinder) {
		lineEndingFinder = new StringFinder(options.newlines);
		lineEndingFinderCache.set(options.newlines, lineEndingFinder);
	}
	lineEndingFinder.findAll(text).forEach(lineEnding => {
		lines.push({
			block: {},
			number: lineNumber++,
			offset: lineOffset,
			text: text.substring(lineOffset, lineEnding.index),
			ending: lineEnding.text
		});
		lineOffset = lineEnding.index + lineEnding.text.length;
	});
	if (lineOffset < text.length || text === '') {
		lines.push({
			block: {},
			number: lineNumber,
			offset: lineOffset,
			text: text.substr(lineOffset),
			ending: ''
		});
	}

	if (options.blocks) {
		var blocks = Array.isArray(options.blocks) ? options.blocks : [options.blocks];
		blocks.forEach((blockOptions: linez.BlockOptions) => {
			addBlockProp(lines, blockOptions);
		});
	}

	return lines;
}

function testString(str: string, expression: string|RegExp) {
	if (expression instanceof RegExp) {
		return expression.test(str);
	} else {
		return str.trim() === expression;
	}
}

function addBlockProp(lines: linez.Line[], blockOptions: linez.BlockOptions) {
	var blockLines: linez.Line[]|null;

	lines.forEach((line: linez.Line) => {
		if (testString(line.text, blockOptions.start)) {
			blockLines = [line];
		} else if (testString(line.text, blockOptions.end)) {
			if (blockLines) {
				blockLines.push(line);
				blockLines[0].block[blockOptions.type] = blockLines;
			}
			blockLines = null;
		} else if (blockLines) {
			blockLines.push(line);
		}
	});
}

namespace linez {

	export class Document {

		get bom() {
			return boms[this.charset];
		}

		private _charset = '';

		get charset() {
			return this._charset;
		}

		set charset(value: string) {
			if (!value) {
				this._charset = '';
				return;
			}
			if (!iconv.encodingExists(value.replace(/-bom$/, ''))) {
				throw new Error('Unsupported charset: ' + value);
			}
			this._charset = value;
		}

		lines: Line[];

		constructor(lines?: Line[]) {
			this.lines = lines || [];
		}

		toBuffer() {
			var charset = this.charset.replace(/-bom$/, '');
			var contents: Buffer;
			if (iconv.encodingExists(charset)) {
				contents = iconv.encode(this.toString(), charset);
			} else {
				contents = new Buffer(this.toString());
			}
			if (this.bom) {
				contents = Buffer.concat([this.bom, contents]);
			}
			return contents;
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
		block: { [type: string]: Line[] };
	}

	export interface Options {
		newlines?: string[]|RegExp;
		blocks?: BlockOptions[]|BlockOptions;
	}

	export interface BlockOptions {
		type: string;
		start: string|RegExp;
		end: string|RegExp;
	}

	export function configure(options?: Options) {
		return objectAssign(globalOptions, options);
	}

	export function resetConfiguration() {
		globalOptions = {
			blocks: {
				type: 'multilineComment',
				start: /^\s*\/\*+\s*$/,
				end: /^\s*\*+\/\s*$/,
			},
			newlines: /\r?\n/g,
		};
	}

}

linez.resetConfiguration();

export = linez;
