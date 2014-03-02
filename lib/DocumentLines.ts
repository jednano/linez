import ILine = require('interfaces/ILine');


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

export = DocumentLines;
