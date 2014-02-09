///<reference path='../bower_components/dt-node/node.d.ts'/>
import ILine = require('./ILine');
import INewlineFinder = require('./INewlineFinder');
import ILineCallback = require('./ILineCallback');

class LineEmitter {

	private newlineFinder: INewlineFinder;
	private callback: ILineCallback;
	private buffer = '';
	private lineNumber = 0;
	private offset = 0;

	constructor(newlineFinder: INewlineFinder, callback: ILineCallback) {
		this.newlineFinder = newlineFinder;
		this.callback = callback;
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

	private createLine(text: string, newline: string) {
		var line: ILine = {
			number: ++this.lineNumber,
			text: text,
			newline: newline,
			offset: this.offset
		};
		this.offset += text.length + newline.length;
		return line;
	}

	private emitLine(line: ILine) {
		this.callback(null, line);
	}

	public flushLines() {
		if (this.buffer) {
			this.emitLine(this.createLine(this.buffer, ''));
		}
	}
}

export = LineEmitter;
