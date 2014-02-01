import charsets = require('./charsets');
import boms = require('./boms');


var map: { [id: number]: string } = {};
map[charsets.utf_8_bom] = boms.utf_8;
map[charsets.utf_16le] = boms.utf_16le;
map[charsets.utf_16be] = boms.utf_16be;
map[charsets.utf_32le] = boms.utf_32le;
map[charsets.utf_32be] = boms.utf_32be;

var reverseMap: { [id: string]: charsets } = {};
Object.keys(map).forEach((key: string) => {
	var bom = map[key];
	reverseMap[bom] = parseInt(key, 10);
});

var matchOrder = [
	boms.utf_8,
	boms.utf_32le,
	boms.utf_16be,
	boms.utf_16le,
	boms.utf_32be
];

var bomPat = new RegExp('^(' + matchOrder.join('|') + ')');

class BOM {
	constructor(public signature?: string) {
		if (signature && !bomPat.test(signature)) {
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

	static detect(s: string): BOM {
		if (s) {
			var m = s.match(bomPat);
			return m && new BOM(m[1]);
		}
		// ReSharper disable once NotAllPathsReturnValue
	}
}

export = BOM;
