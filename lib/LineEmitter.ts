///<reference path='../bower_components/dt-node/node.d.ts'/>
import fs = require('fs');
import ILine = require('./ILine');
import events = require('./events');
import BOM = require('./BOM');
import stream = require('stream');



class LineEmitter extends events.EventEmitter {

	private rawLinesPattern = /([^\r\n]*)(\r?\n)?/g;
	private savedLine: ILine;
	private lineNumber = 0;

	constructor(streamOrString: any, newlines?: string[]) {
		super();
		this.rawLinesPattern = this.createRawLinesPattern(newlines) || this.rawLinesPattern;
		if (typeof streamOrString === 'string') {
			//var s = new stream.Readable();
			setTimeout(() => {
				this.onData(streamOrString);
				this.onEnd();
			});
		} else {
			streamOrString.on('data', this.onData.bind(this));
			streamOrString.on('end', this.onEnd.bind(this));
		}
	}

	private createRawLinesPattern(newlines: string[]) {
		if (!newlines) {
			return;
		}
		newlines = newlines.map((sequence: string) => {
			return '\\' + sequence.split('').join('\\');
		});
		var nl = '(?:' + newlines.join('|') + ')';
		return new RegExp('([^' + nl + ']*)(' + nl + ')?', 'g');
	}

	private onData(chunk: any) {
		chunk.toString().replace(this.rawLinesPattern, (match, text, newline, offset) => {
			var line: ILine = {
				number: ++this.lineNumber,
				text: text,
				offset: offset
			};
			if (newline) {
				line.newline = newline;
			}
			this.onLine(line);
		});
	}

	private onLine(line: ILine) {
		if (line.text === '' && !line.newline) {
			return;
		}
		if (!line.newline) {
			this.savedLine = line;
			return;
		}
		this.emit('line', line);
	}

	private onEnd() {
		if (this.savedLine) {
			this.emit('line', this.savedLine);
		}
		this.emit('end');
	}
}

export = LineEmitter;
