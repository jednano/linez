///<reference path='../bower_components/dt-node/node.d.ts'/>
import Newline = require('./Newline');
import charsets = require('./charsets');
import LineOptions = require('./LineOptions');
import BOM = require('./BOM');


class Line {
	private _number: number;
	private _bom: BOM;
	private _newline: Newline;
	private _text: string;
	private _charset: charsets;

	constructor(raw?: string, options?: LineOptions) {
		options = options || {};
		this._number = options.number;
		if (this._number === 1) {
			this.bom = BOM.detect(raw);
		}
		this.newline = this.parseNewline(raw);
		this.text = options.text || this.parseLineForText(raw);
		this.bom = options.bom || this.bom;
		this.charset = options.charset || this.bom && this.bom.charset;
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
			var parsedBom = BOM.detect(this._text);
			if (parsedBom) {
				this._bom = parsedBom;
				this._charset = this._bom.charset;
				this._text = this._text.substr(parsedBom.length);
			}
		} else {
			delete this._bom;
			delete this._charset;
		}
	}

	get bom(): BOM {
		return this._bom;
	}

	set bom(value: BOM) {
		if (!value) {
			delete this._bom;
			delete this._charset;
			return;
		}
		this._bom = value;
		this._charset = this._bom.charset;
		this._number = 1;
	}

	get charset(): charsets {
		return this._charset;
	}

	set charset(value: charsets) {
		if (!value) {
			delete this._charset;
			delete this._bom;
			return;
		}
		this._charset = value;
		this._bom = new BOM();
		this._bom.charset = this._charset;
	}

	get text(): string {
		return this._text;
	}

	set text(value: string) {
		if (!value && value !== '') {
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
		if (!s && s !== '') {
			// ReSharper disable once InconsistentFunctionReturns
			return;
		}
		var start = this._bom ? this._bom.length : 0;
		var length = s.length - start - (this._newline ? this._newline.length : 0);
		return s.substr(start, length);
	}

	private parseNewline(s: string): Newline {
		var m = s && s.match(new RegExp(Newline.pattern.source, 'g'));
		if (!m) {
			// ReSharper disable once InconsistentFunctionReturns
			return;
		}
		if (m.length > 1) {
			throw new Error('A line cannot have more than one newline character');
		}
		return new Newline(m[0]);
	}

	public toString() {
		return this._text;
	}
}

export = Line;
