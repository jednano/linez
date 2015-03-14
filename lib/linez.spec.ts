import sinonChai = require('./test-common');
var expect = sinonChai.expect;
import linez = require('./linez');

// ReSharper disable WrongExpressionStatement
describe('linez', () => {

	it('parses empty text', () => {
		var line = linez('').lines[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('');
		expect(line.ending).to.be.undefined;
	});

	it('parses a single line with no line ending', () => {
		var line = linez('foo').lines[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('foo');
		expect(line.ending).to.be.undefined;
	});

	it('parses a single line with a line ending', () => {
		var line = linez('foo\n').lines[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('foo');
		expect(line.ending).to.eq('\n');
	});

	it('sets proper line offsets', () => {
		var lines = linez('f\noo\r\nbar').lines;
		expect(lines[0].offset).to.eq(0);
		expect(lines[1].offset).to.eq(2);
		expect(lines[2].offset).to.eq(6);
	});

	it('sets proper line numbers', () => {
		var lines = linez('foo\nbar\nbaz').lines;
		expect(lines[0].number).to.eq(1);
		expect(lines[1].number).to.eq(2);
		expect(lines[2].number).to.eq(3);
	});

	it('sets proper line text', () => {
		var lines = linez('foo\nbar\nbaz').lines;
		expect(lines[0].text).to.eq('foo');
		expect(lines[1].text).to.eq('bar');
		expect(lines[2].text).to.eq('baz');
	});

	it('sets proper line endings', () => {
		var lines = linez('foo\nbar\r\nbaz').lines;
		expect(lines[0].ending).to.eq('\n');
		expect(lines[1].ending).to.eq('\r\n');
		expect(lines[2].ending).to.be.undefined;
	});

	describe('configure method',() => {
		beforeEach(() => {
			linez.resetConfiguration();
		});

		it('supports a custom newlines string array', () => {
			linez.configure({
				newlines: ['\t', '\u0085', '\r']
			});
			var lines = linez('foo\rbar\tbaz\u0085qux\n').lines;
			expect(lines[0].text).to.eq('foo');
			expect(lines[0].ending).to.eq('\r');
			expect(lines[1].text).to.eq('bar');
			expect(lines[1].ending).to.eq('\t');
			expect(lines[2].text).to.eq('baz');
			expect(lines[2].ending).to.eq('\u0085');
			expect(lines[3].text).to.eq('qux\n');
			expect(lines[3].ending).to.be.undefined;
		});

		it('errors when no configuration options are sent', () => {
			var fn = () => {
				linez.configure(void (0));
			};
			expect(fn).to.throw('No configuration options to configure');
		});
	});

	it('supports resetting the configuration', () => {
		linez.configure({ newlines: ['bar'] });
		var lines = linez('foobar').lines;
		expect(lines[0].ending).to.eq('bar');
		linez.resetConfiguration();
		lines = linez('foo\n').lines;
		expect(lines[0].ending).to.eq('\n');
	});

	describe('Document', () => {
		var contents: string;
		var doc: linez.Document;
		before(() => {
			contents = 'foo\nbar';
			doc = linez(contents);
		});

		it('constructs a document with lines', () => {
			expect(doc).to.exist;
			expect(doc.lines).to.have.length(2);
		});

		it('converts lines into a string with toString()', () => {
			expect(doc + '').to.eq(contents);
			expect(new linez.Document() + '').to.be.empty;
		});
	});

});
