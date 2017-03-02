var iconv = require('iconv-lite');
var bufferEquals = require('buffer-equals');

import { expect } from './test-common';
import * as linez from './linez';

describe('linez', () => {

	it('parses empty text', () => {
		var line = linez('').lines[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.be.empty;
		expect(line.ending).to.be.empty;
	});

	it('parses a single line with no line ending', () => {
		var line = linez('foo').lines[0];
		expect(line.offset).to.eq(0);
		expect(line.number).to.eq(1);
		expect(line.text).to.eq('foo');
		expect(line.ending).to.be.empty;
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
		expect(lines[2].ending).to.be.empty;
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
			expect(lines[3].ending).to.be.empty;
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

		it('constructs a document with lines', () => {
			var doc = linez('foo\nbar');
			expect(doc).to.exist;
			expect(doc.lines).to.have.length(2);
		});

		it('converts doc into a buffer with toBuffer()', () => {
			var contents = Buffer.concat([
				new Buffer([0xef, 0xbb, 0xbf]),
				new Buffer('foo')
			]);
			var doc = linez(contents);
			expect(bufferEquals(doc.toBuffer(), contents)).to.be.true;
		});

		it('converts a signed doc into a buffer with toBuffer()', () => {
			var contents = new Buffer('foo');
			var doc = linez(contents);
			expect(bufferEquals(doc.toBuffer(), contents)).to.be.true;
		});

		it('converts an unsigned doc into a string with toString()', () => {
			var contents = 'foo\nbar';
			var doc = linez(contents);
			expect(doc + '').to.eq(contents);
			expect(new linez.Document() + '').to.be.empty;
		});

		it('throws when trying to set an unsupported charset', () => {
			var fn = () => {
				new linez.Document().charset = 'foo';
			};
			expect(fn).to.throw('Unsupported charset: foo');
		});

		describe('byte order marks', () => {

			it('detects and decodes a utf-8-bom document', () => {
				var doc = linez(Buffer.concat([
					new Buffer([0xef, 0xbb, 0xbf]),
					new Buffer('foo')
				]));
				expect(doc.charset).to.eq('utf-8-bom');
				expect(doc.lines[0].text).to.eq('foo');
			});

			it('detects and decodes utf-16le bom document', () => {
				var doc = linez(Buffer.concat([
					new Buffer([0xff, 0xfe]),
					iconv.encode('foo', 'utf16le')
				]));
				expect(doc.charset).to.eq('utf-16le');
				expect(doc.lines[0].text).to.eq('foo');
			});

			it('detects and decodes utf-16be bom document', () => {
				var doc = linez(Buffer.concat([
					new Buffer([0xfe, 0xff]),
					iconv.encode('foo', 'utf16be')
				]));
				expect(doc.charset).to.eq('utf-16be');
				expect(doc.lines[0].text).to.eq('foo');
			});

			it('throws an unsupported charset error for utf-32le bom', () => {
				var fn = () => {
					linez(new Buffer([0xff, 0xfe, 0x00, 0x00]));
				};
				expect(fn).to.throw('Unsupported charset: utf-32le');
			});

			it('throws an unsupported charset error for utf-32be bom', () => {
				var fn = () => {
					linez(new Buffer([0x00, 0x00, 0xfe, 0xff]));
				};
				expect(fn).to.throw('Unsupported charset: utf-32be');
			});

			it('decodes unsigned docs as utf8 by default', () => {
				var doc = linez(new Buffer('foo'));
				expect(doc.charset).to.be.empty;
				expect(doc.lines[0].text).to.eq('foo');
			});

		});
	});
});
