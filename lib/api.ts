﻿///<reference path="../bower_components/dt-node/node.d.ts" />
///<reference path="../node_modules/promise-ts/promise-ts.d.ts" />
require('typescript-require');
import _Line = require('./Line');
import p = require('promise-ts');
var Deferred = p.Deferred;


export var boms = require('./boms');
export var BOM = require('./BOM');
export var charsets = require('./charsets');
export var Line = _Line;
export var newlines = require('./newlines');
export var Newline = require('./Newline');

export function parse(text: string): p.Promise {
	var parsing = new Deferred();
	setTimeout(() => {
		parsing.resolve(parseSync(text));
	});
	return parsing.promise;
}

//export function parse(text: string, callback: Function) {
//	var emitter = new LineEmitter(text);
//	var lines: ILine[] = [];
//	emitter.on('line', (line: ILine) => {
//		lines.push(line);
//	});
//	emitter.on('end', () => {
//		callback(lines);
//	});
//}

export function parseSync(text: string): _Line[] {
	var newline = Newline.pattern.source;
	var wholeLinesPat = new RegExp('[^(' + newline + ')]*(' + newline + ')?', 'g');
	var rawLines = text.match(wholeLinesPat) || [];
	var lines: _Line[] = [];
	for (var i = 0, rawLine: string; rawLine = rawLines.shift();) {
		var line = new Line(rawLine);
		line.number = ++i;
		lines.push(line);
	}
	return lines;
}

var _newlineFinder = new RegExpNewlineFinder(/(\r?\n)/);

export function configure(newlineFinder: INewlineFinder) {
	_newlineFinder = newlineFinder;
}

export function parseFile(filepath: string, encoding: string) {
	var emitter = new LineEmitter(_newlineFinder);

	var stream = fs.createReadStream('test/fixtures/lines.txt');
	stream.on('data', (chunk: any) => {
		emitter.pushLines(chunk.toString());
	});
	stream.on('end', () => {
		emitter.flushLines();
	});
	stream.resume(); // causes lines to be emitted;

	return emitter; // problem: lines are emitted before the caller can attach 'line' handlers
}

export function parseText(text: string) {
	var emitter = new LineEmitter(_newlineFinder);
	emitter.pushLines(text);
	emitter.flushLines();
	return emitter; // problem: lines are emitted before the caller can attach 'line' handlers
}


