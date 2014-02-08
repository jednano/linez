﻿///<reference path="../bower_components/dt-node/node.d.ts" />
///<reference path="../node_modules/promise-ts/promise-ts.d.ts" />
require('typescript-require');
import _Line = require('./Line');
import p = require('promise-ts');
var Deferred = p.Deferred;
import LineEmitter = require('./LineEmitter');
import ILine = require('./ILine');


export var boms = require('./boms');
export var BOM = require('./BOM');
export var charsets = require('./charsets');
export var Line = _Line;
export var newlines = require('./newlines');
export var Newline = require('./Newline');

export function parse(text: string, callback: Function) {
	var emitter = new LineEmitter(text);
	var lines: ILine[] = [];
	emitter.on('line', (line: ILine) => {
		lines.push(line);
	});
	emitter.on('end', () => {
		callback(lines);
	});
}

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
