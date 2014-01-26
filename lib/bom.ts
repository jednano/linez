export var map = {
	utf_8: '\u00EF\u00BB\u00BF',
	utf_16be: '\u00FE\u00FF',
	utf_32le: '\u00FF\u00FE\u0000\u0000',
	utf_16le: '\u00FF\u00FE',
	utf_32be: '\u0000\u0000\u00FE\u00FF'
};

export var reverseMap = {}; 
export var chars = [];
Object.keys(map).forEach((key: string) => {
	var bom = map[key];
	reverseMap[bom] = key;
	chars[bom] = key;
});

var startsWithBom = new RegExp('^(' + chars.join('|') + ')');
export function parse(s: string): string {
	if (s) {
		var m = s.match(startsWithBom);
		return m && m[1];
	}
	// ReSharper disable once NotAllPathsReturnValue
}
