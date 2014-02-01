import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import linez = require('../../lib/api');
import Line = require('../../lib/Line');
import newlines = require('../../lib/newlines');
import Newline = require('../../lib/Newline');
import charsets = require('../../lib/charsets');


// ReSharper disable WrongExpressionStatement
describe('linez', () => {

	it('parse method parses text asynchronously', done => {
		linez.parse('foo').done((lines: Line[]) => {
			expect(lines).to.have.lengthOf(1);
			expect(lines[0].text).to.equal('foo');
			done();
		});
	});

	it('parseSync method parses text synchronously', () => {
		var lines = linez.parseSync('foo');
		expect(lines).to.have.lengthOf(1);
		expect(lines[0].text).to.equal('foo');
	});

	it('parses lines with BOM signature', done => {
		linez.parse('\u00FE\u00FFfoo').done((lines: Line[]) => {
			expect(lines).to.have.lengthOf(1);
			var line1 = lines[0];
			expect(line1.charset).to.equal(charsets.utf_16be);
			expect(line1.text).to.equal('foo');
			done();
		});
	});

	it('parses lines with newline characters', done => {
		linez.parse('foo\r\nbar\n').done((lines: Line[]) => {
			expect(lines).to.have.lengthOf(2);
			var line1 = lines[0];
			expect(line1.text).to.equal('foo');
			expect(line1.newline.character).to.equal(newlines.crlf);
			var line2 = lines[1];
			expect(line2.text).to.eq('bar');
			expect(line2.newline.character).to.eq(newlines.lf);
			done();
		});
	});

});
