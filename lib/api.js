///<reference path="../bower_components/dt-node/node.d.ts" />
///<reference path="../node_modules/promise-ts/promise-ts.d.ts" />
require('typescript-require');
var _Line = require('./Line');
var p = require('promise-ts');
var Deferred = p.Deferred;

exports.boms = require('./boms');
exports.BOM = require('./BOM');
exports.charsets = require('./charsets');
exports.Line = _Line;
exports.newlines = require('./newlines');
exports.Newline = require('./Newline');

function parse(text) {
    var parsing = new Deferred();
    setTimeout(function () {
        parsing.resolve(exports.parseSync(text));
    });
    return parsing.promise;
}
exports.parse = parse;

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
function parseSync(text) {
    var newline = exports.Newline.pattern.source;
    var wholeLinesPat = new RegExp('[^(' + newline + ')]*(' + newline + ')?', 'g');
    var rawLines = text.match(wholeLinesPat) || [];
    var lines = [];
    for (var i = 0, rawLine; rawLine = rawLines.shift();) {
        var line = new exports.Line(rawLine);
        line.number = ++i;
        lines.push(line);
    }
    return lines;
}
exports.parseSync = parseSync;
