/// <reference path="node_modules/promise-ts/promise-ts.d.ts" />


declare module "linez" {
	export = Linez;
}

declare module Linez {

	class BOM {
		public signature: string;
		constructor(signature: string);
		public charset: charsets;
		public length: number;
		public toString(): string;
		static detectLeadingBOM(s: string): BOM;
		private static matchOrder;
		static pattern: RegExp;
		static map: {
			[id: number]: string;
		};
		static reverseMap: {
			[id: string]: charsets;
		};
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
		private _number;
		private _bom;
		private _newline;
		private _text;
		private _charset;
		constructor(raw?: string, options?: LineOptions);
		public number: number;
		public bom: BOM;
		public charset: charsets;
		public text: string;
		public newline: Newline;
		public raw: string;
		private parseLineForText(s);
		private parseNewline(s);
		public toString(): string;
	}

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
		constructor(character: string);
		public name: string;
		public length: number;
		public toString(): string;
		static pattern: RegExp;
		static reverseMap: {};
		static chars: any[];
	}

	function parse(text: string): PromiseTs.Promise;
	function parseSync(text: string): Line[];
}
