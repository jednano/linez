///<reference path='../bower_components/dt-node/node.d.ts'/>
import ILine = require('./ILine');
import _events = require('./events');


class LineEmitter extends _events.EventEmitter {

	private newlinesPattern: RegExp;
	private buffer = '';
	private lineNumber = 0;
	private offset = 0;

	constructor(newlines?: string[]) {
		super();
		this.newlinesPattern = this.createNewlinesPattern(newlines || ['\r\n', '\n']);
	}

	private createNewlinesPattern(newlines: string[]) {
		newlines = newlines.map((sequence: string) => {
			return '\\' + sequence.split('').join('\\');
		});
		return new RegExp('(' + newlines.join('|') + ')', 'g');
	}

	public pushLines(lines: string) {
		this.buffer += lines;
		this.newlinesPattern.lastIndex = 0;
		var offset = 0;
		this.findAllMatches(this.buffer, this.newlinesPattern).forEach((match) => {
			var text = this.buffer.substring(offset, match.index);
			var newline = match[0];
			this.emitLine(this.createLine(text, newline));
			offset += text.length + newline.length;
		});
		this.buffer = this.buffer.substr(offset);
	}

	private findAllMatches(s: string, re: RegExp) {
		var results = [];
		var result;
		while(result = re.exec(s)) {
			results.push(result);
		}
		return results;
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
