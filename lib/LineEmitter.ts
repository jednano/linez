///<reference path='../bower_components/dt-node/node.d.ts'/>
import ILine = require('./ILine');
import _events = require('./events');
import INewlineFinder = require('./INewlineFinder');


class LineEmitter extends _events.EventEmitter {

	private newlineFinder: INewlineFinder;
	private buffer = '';
	private lineNumber = 0;
	private offset = 0;

	constructor(newlineFinder: INewlineFinder) {
		super();
		this.newlineFinder = newlineFinder;
	}

	public pushLines(lines: string) {
		this.buffer += lines;
		var offset = 0;
		this.newlineFinder.find(this.buffer).forEach((newline) => {
			var text = this.buffer.substring(offset, newline.index);
			this.emitLine(this.createLine(text, newline.text));
			offset += text.length + newline.text.length;
		});
		this.buffer = this.buffer.substr(offset);
	}

	private createLine(text: string, newline?: string) {
		var line: ILine = {
			number: ++this.lineNumber,
			text: text,
			offset: this.offset
		};
		if (newline) {
			line.newline = newline;
		}
		this.offset += text.length + (newline || '').length;
		return line;
	}

	private emitLine(line: ILine) {
		this.emit('line', line);
	}

	public flushLines() {
		if (this.buffer) {
			this.emitLine(this.createLine(this.buffer));
		}
	}
}

export = LineEmitter;
