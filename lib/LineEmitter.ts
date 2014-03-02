import DocumentLines = require('./DocumentLines');
import ILine = require('interfaces/ILine');
import ILineCallback = require('interfaces/ILineCallback');
import NewlineFinder = require('./NewlineFinder');


class LineEmitter {

	private documentLines = new DocumentLines();
	private buffer = '';

	constructor(private newlineFinder: NewlineFinder, private callback: ILineCallback) {
		return;
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
