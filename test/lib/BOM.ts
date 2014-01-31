import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import linez = require('../../lib/api');
var charsets = linez.charsets;
var BOM = linez.BOM;


// ReSharper disable WrongExpressionStatement
describe('Byte Order Mark (BOM signature)', () => {

	it('detects utf-8-bom signature', () => {
		var bom = new BOM('\u00EF\u00BB\u00BF');
		expect(bom.signature).to.equal('\u00EF\u00BB\u00BF');
		expect(bom.charset).to.equal(charsets.utf_8_bom);
	});

	it('detects utf-16be signature', () => {
		var bom = new BOM('\u00FE\u00FF');
		expect(bom.signature).to.equal('\u00FE\u00FF');
		expect(bom.charset).to.equal(charsets.utf_16be);
	});

	it('detects utf-16le signature', () => {
		var bom = new BOM('\u00FF\u00FE');
		expect(bom.signature).to.equal('\u00FF\u00FE');
		expect(bom.charset).to.equal(charsets.utf_16le);
	});

	it('detects utf-32le signature', () => {
		var bom = new BOM('\u00FF\u00FE\u0000\u0000');
		expect(bom.signature).to.equal('\u00FF\u00FE\u0000\u0000');
		expect(bom.charset).to.equal(charsets.utf_32le);
	});

	it('detects utf-32be signature', () => {
		var bom = new BOM('\u0000\u0000\u00FE\u00FF');
		expect(bom.signature).to.equal('\u0000\u0000\u00FE\u00FF');
		expect(bom.charset).to.equal(charsets.utf_32be);
	});

	it('throws an error if invalid or unsupported', () => {
		var fn = () => {
			new BOM('\u00AA');
		};
		expect(fn).to.throw(Error, 'Invalid or unsupported BOM signature');
	});
});
