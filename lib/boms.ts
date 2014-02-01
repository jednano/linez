var boms = {
	utf_8: '\u00EF\u00BB\u00BF',
	utf_16le: '\u00FF\u00FE',
	utf_16be: '\u00FE\u00FF',
	utf_32le: '\u00FF\u00FE\u0000\u0000',
	utf_32be: '\u0000\u0000\u00FE\u00FF'
};

export = boms;
