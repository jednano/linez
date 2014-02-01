import newlines = require('./newlines');


var reverseMap = {};
var chars = [];

Object.keys(newlines).forEach((key: string) => {
	var c = newlines[key];
	reverseMap[c] = key;
	chars.push(c);
});

var newlinePat = /\n|\r(?!\n)|\u000B|\u000C|\u0085|\u2028|\u2029|\r\n/;

class Newline {
	constructor(public character?: string) {
		if (character && !newlinePat.test(character)) {
			throw new Error('Invalid or unsupported newline character');
		}
	}

	get name(): string {
		return reverseMap[this.character];
	}

	set name(value: string) {
		this.character = newlines[value];
	}

	get length(): number {
		return this.character && this.character.length;
	}

	toString(): string {
		return this.character;
	}

	/**
	 * Gets the newline pattern used to parse newlines out of text.
	 */
	static pattern = newlinePat;

	static detect(lineText: string): Newline {
		var m = lineText && lineText.match(new RegExp(newlinePat.source, 'g'));
		if (!m) {
			// ReSharper disable once InconsistentFunctionReturns
			return;
		}
		if (m.length > 1) {
			throw new Error('A line cannot have more than one newline character');
		}
		return new Newline(m[0]);
	}
}

export = Newline;
