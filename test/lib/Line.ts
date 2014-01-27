import linez = require('../../lib/linez');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import Line = require('../../lib/Line');
import charsets = require('../../lib/charsets');
import BOM = require('../../lib/BOM');


// ReSharper disable WrongExpressionStatement
describe('Line', () => {
	describe('BOM signature', () => {

		it('is ignored when not line number 1', () => {
			var line = new Line('\u00EF\u00BB\u00BFfoo\n');
			expect(line.bom).to.be.undefined;
			expect(line.charset).to.be.undefined;
			expect(line.text).to.equal('\u00EF\u00BB\u00BFfoo');
		});

		it('is detected when assigned line number 1', () => {
			var line = new Line('\u00EF\u00BB\u00BFfoo');
			expect(line.bom).to.be.undefined;
			line.number = 1;
			expect(line.bom.signature).to.equal('\u00EF\u00BB\u00BF');
			expect(line.charset).to.equal(charsets.utf_8_bom);
			expect(line.text).to.equal('foo');
		});

		it('allows creation of a solo BOM signature', () => {
			var line = new Line('\u0000\u0000\u00FE\u00FF', { number: 1 });
			expect(line.bom.signature).to.equal('\u0000\u0000\u00FE\u00FF');
			expect(line.charset).to.equal(charsets.utf_32be);
		});
	});

	it('separates line text from the BOM signature and newline character', () => {
		var line = new Line('\u00EF\u00BB\u00BFfoo\n', { number: 1 });
		expect(line.bom.signature).to.equal('\u00EF\u00BB\u00BF');
		expect(line.charset).to.equal(charsets.utf_8_bom);
		expect(line.text).to.equal('foo');
		expect(line.newline.character).to.equal('\n');
		expect(line.raw).to.equal('\u00EF\u00BB\u00BFfoo\n');
	});

	it('allows creation of an undefined line', () => {
		var line = new Line();
		expect(line.number).to.be.undefined;
		expect(line.bom).to.be.undefined;
		expect(line.charset).to.be.undefined;
		expect(line.text).to.be.undefined;
		expect(line.newline).to.be.undefined;
		expect(line.raw).to.be.undefined;
	});

	it('allows creation of an empty line', () => {
		var line = new Line('');
		expect(line.text).to.equal('');
	});

	it('allows creation of a solo newline character', () => {
		var line = new Line('\n');
		expect(line.text).to.equal('');
		expect(line.newline.character).to.equal('\n');
	});
});
