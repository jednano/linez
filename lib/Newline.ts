import newlines = require('./newlines');


var reverseMap = {};
var chars = [];

Object.keys(newlines).forEach((key: string) => {
	var c = newlines[key];
	reverseMap[c] = key;
	chars.push(c);
});

class Newline {
	constructor(public character: string) {
		if (!Newline.pattern.test(character)) {
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

	public toString(): string {
		return this.character;
	}

	static pattern = /\n|\r(?!\n)|\u000B|\u000C|\u0085|\u2028|\u2029|\r\n/;

	static reverseMap = reverseMap;

	static chars = chars;
}

export = Newline;
