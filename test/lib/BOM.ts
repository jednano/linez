import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import linez = require('../../lib/api');
import charsets = require('../../lib/charsets');
import boms = require('../../lib/boms');
import BOM = require('../../lib/BOM');


// ReSharper disable WrongExpressionStatement
describe('Byte Order Mark (BOM signature)', () => {

	it('detects utf-8-bom signature', () => {
		var bom = new BOM(boms.utf_8);
		expect(bom.signature).to.equal(boms.utf_8);
		expect(bom.charset).to.equal(charsets.utf_8_bom);
	});

	it('detects utf-16be signature', () => {
		var bom = new BOM(boms.utf_16be);
		expect(bom.signature).to.equal(boms.utf_16be);
		expect(bom.charset).to.equal(charsets.utf_16be);
	});

	it('detects utf-16le signature', () => {
		var bom = new BOM(boms.utf_16le);
		expect(bom.signature).to.equal(boms.utf_16le);
		expect(bom.charset).to.equal(charsets.utf_16le);
	});

	it('detects utf-32le signature', () => {
		var bom = new BOM(boms.utf_32le);
		expect(bom.signature).to.equal(boms.utf_32le);
		expect(bom.charset).to.equal(charsets.utf_32le);
	});

	it('detects utf-32be signature', () => {
		var bom = new BOM(boms.utf_32be);
		expect(bom.signature).to.equal(boms.utf_32be);
		expect(bom.charset).to.equal(charsets.utf_32be);
	});

	it('throws an error if invalid or unsupported', () => {
		var fn = () => {
			new BOM('\u00AA');
		};
		expect(fn).to.throw(Error, 'Invalid or unsupported BOM signature');
	});
});
