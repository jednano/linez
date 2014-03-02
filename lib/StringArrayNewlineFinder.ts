import NewlineFinder = require('./NewlineFinder');


class StringArrayNewlineFinder extends NewlineFinder {

	constructor(newlines: string[]) {
		newlines = newlines.map((sequence: string) => {
			return '\\' + sequence.split('').join('\\');
		});
		super(new RegExp('(' + newlines.join('|') + ')', 'g'));
	}

}

export = StringArrayNewlineFinder;
