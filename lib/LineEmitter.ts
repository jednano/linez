///<reference path='../bower_components/dt-node/node.d.ts'/>
import ILine = require('./ILine');
import INewlineFinder = require('./INewlineFinder');
import ILineCallback = require('./ILineCallback');

class DocumentLines {

	private lineNumber = 1;
	private offset = 0;

	public createLine(text: string, newline: string) {
		var line: ILine = {
			number: this.lineNumber,
			text: text,
			newline: newline,
			offset: this.offset
		};
		this.lineNumber++;
		this.offset += text.length + newline.length;
		return line;
	}

}

class LineEmitter {

	private newlineFinder: INewlineFinder;
	private callback: ILineCallback;
	private documentLines = new DocumentLines();
	private buffer = '';

	constructor(newlineFinder: INewlineFinder, callback: ILineCallback) {
		this.newlineFinder = newlineFinder;
		this.callback = callback;
	}

	public pushLines(lines: string) {
		this.buffer += lines;
		var offset = 0;
		this.newlineFinder.find(this.buffer).forEach((newline) => {
			var text = this.buffer.substring(offset, newline.index);
			this.emitLine(text, newline.text);
			offset += text.length + newline.text.length;
		});
		this.buffer = this.buffer.substr(offset);
	}

	private emitLine(text: string,  newline: string) {
		var line = this.documentLines.createLine(text, newline);
		this.callback(null, line);
	}

	public flushLines() {
		if (this.buffer) {
			this.emitLine(this.buffer, '');
		}
	}
}

export = LineEmitter;
