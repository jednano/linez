﻿///<reference path="../bower_components/dt-node/node.d.ts" />
import events = require('events');
var EventEmitter = events.EventEmitter;
import fs = require('fs');
import util = require('util');

import ILine = require('interfaces/ILine');
import ILineCallback = require('interfaces/ILineCallback');
import ILinezOptions = require('interfaces/ILinezOptions');
import IParseFileOptions = require('interfaces/IParseFileOptions');
import LineEmitter = require('./LineEmitter');
import NewlineFinder = require('./NewlineFinder');


class Linez extends events.EventEmitter {

	private config: ILinezOptions = {
		encoding: 'utf8',
		newlinesExpression: /\r?\n/g
	};

	constructor(config?: ILinezOptions) {
		super();
		if (config) {
			this.extendConfiguration(config);
		}
	}

	public extendConfiguration(options: ILinezOptions) {
		(<any>util)._extend(this.config, options);
	}

	public parseText(text: string, callback: ILineCallback) {
		var emitter = new LineEmitter(
			new NewlineFinder(this.config.newlinesExpression),
			(err: Error, line: ILine) => {
				callback(err, line);
			});
		emitter.pushLines(text);
		emitter.flushLines();
	}

	public parseFile(path: string, options?: IParseFileOptions): EventEmitter {

		if (options) {
			this.extendConfiguration(options);
		}

		var ee = new EventEmitter();
		var lineEmitter = new LineEmitter(
			new NewlineFinder(this.config.newlinesExpression),
			(err: Error, line: ILine) => {
				ee.emit('line', err, line);
			});
		var stream = fs.createReadStream(path, {
			encoding: this.config.encoding
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

}

export = Linez;
