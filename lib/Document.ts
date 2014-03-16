import ILine = require('./ILine');


class Document {

	constructor(public lines: ILine[]) {
		return;
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
