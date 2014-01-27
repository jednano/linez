import charsets = require('./charsets');


export var map: { [id: number]: string } = {};
map[charsets.utf_8_bom] = '\u00EF\u00BB\u00BF';
map[charsets.utf_16be] = '\u00FE\u00FF';
map[charsets.utf_32le] = '\u00FF\u00FE\u0000\u0000';
map[charsets.utf_16le] = '\u00FF\u00FE';
map[charsets.utf_32be] = '\u0000\u0000\u00FE\u00FF';

export var reverseMap: { [id: string]: charsets } = {}; 
export var chars = [];
Object.keys(map).forEach((key: string) => {
	var bom = map[key];
	reverseMap[bom] = parseInt(key, 10);
	chars.push(bom);
});

var matchOrder = [
	'\u00EF\u00BB\u00BF',
	'\u00FF\u00FE\u0000\u0000',
	'\u00FE\u00FF',
	'\u00FF\u00FE',
	'\u0000\u0000\u00FE\u00FF'
];
var startsWithBom = new RegExp('^(' + matchOrder.join('|') + ')');
export function parse(s: string): string {
	if (s) {
		var m = s.match(startsWithBom);
		return m && m[1];
	}
	// ReSharper disable once NotAllPathsReturnValue
}
