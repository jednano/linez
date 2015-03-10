import ILine = require('./ILine');


class Document {

	public lines: ILine[];

	constructor(lines?: ILine[]) {
		this.lines = lines || [];
	}

	toString() {
		var contents = '';
		this.lines.forEach(line => {
			contents += line.text + line.ending;
		});
		return contents;
	}

}

export = Document;
