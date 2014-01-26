import charsets = require('./charsets');
import Newline = require('./Newline');


interface LineOptions {
	number?: number;
	bom?: string;
	charset?: charsets;
	newline?: Newline;
	text?: string;
}

export = LineOptions;
