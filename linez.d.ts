/// <reference path="node_modules/promise-ts/promise-ts.d.ts" />


declare module "linez" {
	export = Linez;
}

declare module Linez {

	var boms: {
		utf_8: string;
		utf_16le: string;
		utf_16be: string;
		utf_32le: string;
		utf_32be: string;
	};

	class BOM {
		public signature: string;
		constructor(signature?: string);
		public charset: charsets;
		public length: number;
		public toString(): string;
		static detect(s: string): BOM;
	}

	enum charsets {
		latin1 = 0,
		utf_8 = 1,
		utf_8_bom = 2,
		utf_16be = 3,
		utf_16le = 4,
		utf_32be = 5,
		utf_32le = 6,
	}

	class Line {
		/**
		 * Setting to a value of 1 will detect and set both BOM signature and charset.
		 * Setting to a value other than 1 will delete both BOM signature and charset.
		 */
		private _number;
		/**
		 * Setting the bom changes the line number to 1 and sets the
		 * appropriate charset for the new BOM signature.
		 */
		private _bom;
		private _newline;
		private _text;
		/**
		 * Setting the charset changes the line number to 1 and sets the
		 * appropriate BOM signature for the new charset.
		 */
		private _charset;
		constructor(raw?: string, options?: LineOptions);
		public number: number;
		public bom: BOM;
		public charset: charsets;
		public text: string;
		public newline: Newline;
		/**
		 * Gets the BOM signature plus the line text plus the newline.
		 */
		public raw: string;
		private parseLineForText(s);
		/**
		 * Returns just the text portion of the line, with the BOM and newline
		 * stripped off. This is the same as getting line.text.
		 */
		public toString(): string;
	}

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

	var newlines: {
		lf: string;
		crlf: string;
		cr: string;
		vt: string;
		ff: string;
		nel: string;
		ls: string;
		ps: string;
	};

	class Newline {
		public character: string;
		constructor(character?: string);
		public name: string;
		public length: number;
		public toString(): string;
		/**
		 * Gets the newline pattern used to parse newlines out of text.
		 */
		static pattern: RegExp;
		static detect(lineText: string): Newline;
	}

	function parse(text: string): PromiseTs.Promise;
	function parseSync(text: string): Line[];
}
