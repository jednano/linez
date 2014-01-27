var map = {
	// Line Feed, U+000A
	lf: '\n',
	// Carriage Return + Line Feed
	crlf: '\r\n',
	// Carriage Return, U+000D
	cr: '\r',
	// Vertical Tab
	vt: '\u000B',
	// Form Feed
	ff: '\u000C',
	// Next Line
	nel: '\u0085',
	// Line Separator
	ls: '\u2028',
	// Paragraph Separator
	ps: '\u2029'
};

var reverseMap = {};
var chars = [];

Object.keys(map).forEach((key: string) => {
	var c = map[key];
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
		this.character = map[value];
	}

	get length(): number {
		return this.character && this.character.length;
	}

	public toString(): string {
		return this.character;
	}

	static pattern = /\n|\r(?!\n)|\u000B|\u000C|\u0085|\u2028|\u2029|\r\n/;

	static map = map;

	static reverseMap = reverseMap;

	static chars = chars;
}

export = Newline;
