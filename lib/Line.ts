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
		this.newline = Newline.detect(raw);
		this.text = options.text || this.parseLineForText(raw);
		this.bom = options.bom || this.bom;
		this.charset = options.charset || this.bom && this.bom.charset;
	}

	get number(): number {
		return this._number;
	}

	/**
	 * Setting to a value of 1 will detect and set both BOM signature and charset.
	 * Setting to a value other than 1 will delete both BOM signature and charset.
	 */
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

	/**
	 * Setting the bom changes the line number to 1 and sets the
	 * appropriate charset for the new BOM signature.
	 */
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

	/**
	 * Setting the charset changes the line number to 1 and sets the
	 * appropriate BOM signature for the new charset.
	 */
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

	/**
	 * Gets the BOM signature plus the line text plus the newline.
	 */
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

	/**
	 * Returns just the text portion of the line, with the BOM and newline
	 * stripped off. This is the same as getting line.text.
	 */
	public toString() {
		return this._text;
	}
}

export = Line;
