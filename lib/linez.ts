/// <reference path="../node_modules/promise-ts/promise.d.ts" />
import P = require('promise-ts');
var Deferred = P.Deferred;
import Newline = require('./Newline');
import Line = require('./Line');


export function parse(text: string): P.Promise {
	var parsing = new Deferred();
	setTimeout(() => {
		parsing.resolve(parseSync(text));
	});
	return parsing.promise;
}

export function parseSync(text: string): Line[] {
	var newline = Newline.pattern.source;
	var wholeLinesPat = new RegExp('[^(' + newline + ')]*(' + newline + ')?', 'g');
	var rawLines = text.match(wholeLinesPat) || [];
	var lines: Line[] = [];
	for (var i = 0, rawLine: string; rawLine = rawLines.shift();) {
		var line = new Line(rawLine);
		line.number = ++i;
		lines.push(line);
	}
	return lines;
}
