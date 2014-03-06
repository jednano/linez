import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;
import Linez = require('../../../lib/Linez');


// ReSharper disable WrongExpressionStatement
describe('linez', () => {

	var linez: Linez;
	beforeEach(() => {
		linez = new Linez();
	});

	it('parses empty text', () => {
		var line = linez.parse('')[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('');
		expect(line.ending).to.be.undefined;
	});

	it('parses a single line with no line ending', () => {
		var line = linez.parse('foo')[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('foo');
		expect(line.ending).to.be.undefined;
	});

	it('parses a single line with a line ending', () => {
		var line = linez.parse('foo\n')[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('foo');
		expect(line.ending).to.be.eq('\n');
	});

	it('sets proper line offsets', () => {
		var lines = linez.parse('f\noo\r\nbar');
		expect(lines[0].offset).to.eq(0);
		expect(lines[1].offset).to.eq(2);
		expect(lines[2].offset).to.eq(6);
	});

	it('sets proper line numbers', () => {
		var lines = linez.parse('foo\nbar\nbaz');
		expect(lines[0].number).to.eq(1);
		expect(lines[1].number).to.eq(2);
		expect(lines[2].number).to.eq(3);
	});

	it('sets proper line text', () => {
		var lines = linez.parse('foo\nbar\nbaz');
		expect(lines[0].text).to.eq('foo');
		expect(lines[1].text).to.eq('bar');
		expect(lines[2].text).to.eq('baz');
	});

	it('sets proper line endings', () => {
		var lines = linez.parse('foo\nbar\r\nbaz');
		expect(lines[0].ending).to.eq('\n');
		expect(lines[1].ending).to.eq('\r\n');
		expect(lines[2].ending).to.be.undefined;
	});

	it('supports a custom newlines string array', () => {
		linez.newlines = ['\t', '\u0085', '\r'];
		var lines = linez.parse('foo\rbar\tbaz\u0085qux\n');
		expect(lines[0].text).to.eq('foo');
		expect(lines[0].ending).to.eq('\r');
		expect(lines[1].text).to.eq('bar');
		expect(lines[1].ending).to.eq('\t');
		expect(lines[2].text).to.eq('baz');
		expect(lines[2].ending).to.eq('\u0085');
		expect(lines[3].text).to.eq('qux\n');
		expect(lines[3].ending).to.be.undefined;
	});

});
