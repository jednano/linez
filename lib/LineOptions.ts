import charsets = require('./charsets');
import Newline = require('./Newline');
import BOM = require('./BOM');


/**
 * Used to explicitly set properties on a line upon creation.
 * Line options will override anything parsed from the raw line string.
 */
interface LineOptions {
	number?: number;
	bom?: BOM;
	charset?: charsets;
	newline?: Newline;
	text?: string;
}

export = LineOptions;
