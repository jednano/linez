import charsets = require('./charsets');
import Newline = require('./Newline');
import BOM = require('./BOM');


interface LineOptions {
	number?: number;
	bom?: BOM;
	charset?: charsets;
	newline?: Newline;
	text?: string;
}

export = LineOptions;
