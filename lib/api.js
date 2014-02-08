///<reference path="../bower_components/dt-node/node.d.ts" />
///<reference path="../node_modules/promise-ts/promise-ts.d.ts" />
require('typescript-require');
var _Line = require('./Line');
var p = require('promise-ts');
var Deferred = p.Deferred;
var LineEmitter = require('./LineEmitter');

exports.boms = require('./boms');
exports.BOM = require('./BOM');
exports.charsets = require('./charsets');
exports.Line = _Line;
exports.newlines = require('./newlines');
exports.Newline = require('./Newline');

function parse(text, callback) {
    var emitter = new LineEmitter(text);
    var lines = [];
    emitter.on('line', function (line) {
        lines.push(line);
    });
    emitter.on('end', function () {
        callback(lines);
    });
}
exports.parse = parse;

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
