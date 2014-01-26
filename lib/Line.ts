///<reference path='../bower_components/dt-node/node.d.ts'/>
import Newline = require('./Newline');
import charsets = require('./charsets');
import LineOptions = require('./LineOptions');
import bom = require('./bom');


class Line {
	private _number: number;
	private _bom: string;
	private _newline: Newline;
	private _text: string;
	private _charset: charsets;

	constructor(raw?: string, options?: LineOptions) {
		options = options || {};
		this._number = options.number;
		if (this._number === 1) {
			this.bom = bom.parse(raw);
		}
		this.newline = this.parseNewline(raw);
		this.text = options.text || this.parseLineForText(raw);
		this.bom = options.bom || this.bom;
		this.charsets = options.charset || bom.reverseMap[this.bom];
	}

	get number(): number {
		return this._number;
	}

	set number(value: number) {
		if (!value) {
			delete this._number;
			return;
		}
		this._number = value;
		if (value === 1) {
			var parsedBom = bom.parse(this._text);
			if (parsedBom) {
				this._bom = parsedBom;
				this._charset = bom.reverseMap[parsedBom];
				this._text = this._text.substr(parsedBom.length);
			}
		} else {
			delete this._bom;
			delete this._charset;
		}
	}

	get bom(): string {
		return this._bom;
	}

	set bom(value: string) {
		if (!value) {
			delete this._bom;
			delete this._charset;
			return;
		}
		var charset: charsets = charsets[charsets[bom.reverseMap[value]]];
		if (!charset) {
			throw new Error('Invalid or unsupported BOM signature.');
		}
		this._bom = value;
		this._charset = charset;
		this._number = 1;
	}

	get charsets(): charsets {
		return this._charset;
	}

	set charsets(value: charsets) {
		if (!value) {
			delete this._charset;
			delete this._bom;
			return;
		}
		this._charset = value;
		this._bom = bom.map[charsets[value]];
	}

	get text(): string {
		return this._text;
	}

	set text(value: string) {
		if (!value) {
			delete this._text;
			return;
		}
		this._text = value;
	}

	get newline(): Newline {
		return this._newline;
	}

	set newline(value: Newline) {
		if (!value) {
			delete this._newline;
			return;
		}
		this._newline = value;
	}

	get raw(): string {
		if (this._bom || this._text || this._newline) {
			return (this._bom || '') + (this._text || '') +
				(this._newline || '');
		}
		return undefined;
	}

	private parseLineForText(s: string): string {
		if (!s) {
			return undefined;
		}
		var start = this._bom ? this._bom.length : 0;
		var length = s.length - start - (this._newline ? this._newline.length : 0);
		s = s.substr(start, length);
		if (s !== '') {
			return s;
		}
		// ReSharper disable once NotAllPathsReturnValue
	}

	private parseNewline(s: string): Newline {
		var m = s && s.match(new RegExp(Newline.pattern.source, 'g'));
		if (!m) {
			// ReSharper disable once InconsistentFunctionReturns
			return;
		}
		if (m.length > 1) {
			throw new Error('A line cannot have more than one newline character.');
		}
		return new Newline(m[0]);
	}

	public toString() {
		return this._text;
	}
}

export = Line;
