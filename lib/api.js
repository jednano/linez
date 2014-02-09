///<reference path="../bower_components/dt-node/node.d.ts" />
require('typescript-require');
var LineEmitter = require('./LineEmitter');
var RegExpNewlineFinder = require('./RegExpNewlineFinder');

var util = require('util');
var fs = require('fs');
var events = require('events');
var EventEmitter = events.EventEmitter;

var configuration = {
    encoding: 'utf8',
    newlinesExpression: /\r?\n/g
};

function configure(options) {
    extendConfiguration(options);
}
exports.configure = configure;

function parseFile(path, options) {
    if (options) {
        extendConfiguration(options);
    }

    var ee = new EventEmitter();
    var lineEmitter = new LineEmitter(new RegExpNewlineFinder(configuration.newlinesExpression), function (err, line) {
        ee.emit('line', err, line);
    });
    var stream = fs.createReadStream(path, {
        encoding: configuration.encoding
    });

    stream.on('data', function (chunk) {
        lineEmitter.pushLines(chunk);
    });
    stream.on('end', function () {
        lineEmitter.flushLines();
        ee.emit('end');
    });
    stream.resume();

    return ee;
}
exports.parseFile = parseFile;

function parseText(text, callback) {
    var emitter = new LineEmitter(new RegExpNewlineFinder(configuration.newlinesExpression), function (err, line) {
        callback(err, line);
    });
    emitter.pushLines(text);
    emitter.flushLines();
}
exports.parseText = parseText;

function extendConfiguration(options) {
    util._extend(configuration, options);
}
