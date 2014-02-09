﻿///<reference path="../bower_components/dt-node/node.d.ts" />
require('typescript-require');
import LineEmitter = require('./LineEmitter');
import RegExpNewlineFinder = require('./RegExpNewlineFinder');
import IConfigureOptions = require('./IConfigureOptions');
import IParseFileOptions = require('./IParseFileOptions');
import ILineCallback = require('./ILineCallback');
import ILine = require('./ILine');
import util = require('util');
import fs = require('fs');
import events = require('events');
var EventEmitter = events.EventEmitter;


var configuration: IConfigureOptions = {
	encoding: 'utf8',
	newlinesExpression: /\r?\n/g
};

export function configure(options: IConfigureOptions) {
	extendConfiguration(options);
}

export function parseFile(path: string, options?: IParseFileOptions): EventEmitter {

	if (options) {
		extendConfiguration(options);
	}

	var ee = new EventEmitter();
	var lineEmitter = new LineEmitter(
		new RegExpNewlineFinder(configuration.newlinesExpression),
		(err: Error, line: ILine) => {
			ee.emit('line', err, line);
		});
	var stream = fs.createReadStream(path, {
		encoding: configuration.encoding
	});

	stream.on('data', (chunk: string) => {
		lineEmitter.pushLines(chunk);
	});
	stream.on('end', () => {
		lineEmitter.flushLines();
		ee.emit('end');
	});
	stream.resume();

	return ee;
}

export function parseText(text: string, callback: ILineCallback) {
	var emitter = new LineEmitter(
		new RegExpNewlineFinder(configuration.newlinesExpression),
		(err: Error, line: ILine) => {
			callback(err, line);
		});
	emitter.pushLines(text);
	emitter.flushLines();
}

function extendConfiguration(options: IConfigureOptions) {
	(<any>util)._extend(configuration, options);
}
