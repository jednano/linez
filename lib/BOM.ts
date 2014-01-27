import charsets = require('./charsets');


var map: { [id: number]: string } = {};
map[charsets.utf_8_bom] = '\u00EF\u00BB\u00BF';
map[charsets.utf_16be] = '\u00FE\u00FF';
map[charsets.utf_32le] = '\u00FF\u00FE\u0000\u0000';
map[charsets.utf_16le] = '\u00FF\u00FE';
map[charsets.utf_32be] = '\u0000\u0000\u00FE\u00FF';

var reverseMap: { [id: string]: charsets } = {}; 
var chars = [];
Object.keys(map).forEach((key: string) => {
	var bom = map[key];
	reverseMap[bom] = parseInt(key, 10);
	chars.push(bom);
});

class BOM {
	constructor(public signature: string) {
		if (!BOM.pattern.test(signature)) {
			throw new Error('Invalid or unsupported BOM signature');
		}
	}

	get charset(): charsets {
		return reverseMap[this.signature];
	}

	set charset(value: charsets) {
		this.signature = map[value];
	}

	get length(): number {
		return this.signature && this.signature.length;
	}

	public toString(): string {
		return this.signature;
	}

	static detectLeadingBOM(s: string): BOM {
		if (s) {
			var m = s.match(BOM.pattern);
			return m && new BOM(m[1]);
		}
		// ReSharper disable once NotAllPathsReturnValue
	}

	private static matchOrder = [
		'\u00EF\u00BB\u00BF',
		'\u00FF\u00FE\u0000\u0000',
		'\u00FE\u00FF',
		'\u00FF\u00FE',
		'\u0000\u0000\u00FE\u00FF'
	];

	static pattern = new RegExp('^(' + BOM.matchOrder.join('|') + ')');

	static map = map;

	static reverseMap = reverseMap;
}

export = BOM;
