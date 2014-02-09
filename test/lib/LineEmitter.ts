import fs = require('fs');
import sinon = require('sinon');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import ILine = require('../../lib/ILine');
import LineEmitter = require('../../lib/LineEmitter');
import events = require('../../lib/events');
import stream = require('stream');


// ReSharper disable WrongExpressionStatement
describe('LineEmitter', () => {

	it('supports a stream as input', done => {
		var lines = [];
		var emitter = new LineEmitter();
		emitter.on('line', (line: ILine) => {
			lines.push(line);
		});

		var stream = fs.createReadStream('test/fixtures/lines.txt');
		stream.on('data', (chunk: any) => {
			emitter.pushLines(chunk.toString());
		});
		stream.on('end', () => {
			emitter.flushLines();
			var expectedLines = getJSON('test/fixtures/lines.json');
			expect(lines).to.deep.equal(expectedLines);
			done();
		});
		stream.resume();
	});

	it('supports a string as input', () => {
		var emitter = new LineEmitter();
		var fn = sinon.spy();
		emitter.on('line', fn);
		emitter.pushLines('foo');
		emitter.flushLines();
		expect(fn).to.have.been.calledOnce;
	});

	it('emits correct number of lines', () => {
		var emitter = new LineEmitter();
		var fn = sinon.spy();
		emitter.on('line', fn);
		emitter.pushLines('foo\nbar\r\nbaz\n');
		emitter.flushLines();
		expect(fn).to.have.been.calledThrice;
	});

	it('emits the correct line number for each line', () => {
		var emitter = new LineEmitter();
		var expectedLineNumbers = [1, 2, 3];
		emitter.on('line', (line: ILine) => {
			expect(line.number).to.eq(expectedLineNumbers.shift());
		});
		emitter.pushLines('foo\nbar\nbaz');
		emitter.flushLines();
	});

	it('emits the correct offset for each line', () => {
		var emitter = new LineEmitter();
		var expectedOffsets = [0, 4, 8];
		emitter.on('line', (line: ILine) => {
			expect(line.offset).to.eq(expectedOffsets.shift());
		});
		emitter.pushLines('foo\nbar\nbaz');
		emitter.flushLines();
	});

	it('emits the correct text for each line', () => {
		var emitter = new LineEmitter();
		var expectedTexts = ['foo', 'bar', 'baz'];
		emitter.on('line', (line: ILine) => {
			expect(line.text).to.eq(expectedTexts.shift());
		});
		emitter.pushLines('foo\nbar\nbaz');
		emitter.flushLines();
	});

	it('emits the correct newline for each line', () => {
		var emitter = new LineEmitter();
		var expectedNewlines = ['\n', '\r\n'];
		emitter.on('line', (line: ILine) => {
			expect(line.newline).to.eq(expectedNewlines.shift());
		});
		emitter.pushLines('foo\nbar\r\nbaz');
		emitter.flushLines();
	});

	it('supports custom newline sequences', () => {
		var emitter = new LineEmitter(['*+', '{.', '|', '\t']);
		var expectedTexts = ['foo\n', 'bar\r\n', 'baz', 'qux'];
		var expectedNewlines = ['\t', '|', '{.', '*+'];
		emitter.on('line', (line: ILine) => {
			expect(line.text).to.eq(expectedTexts.shift());
			expect(line.newline).to.eq(expectedNewlines.shift());
		});
		emitter.pushLines('foo\n\tbar\r\n|baz{.qux*+');
		emitter.flushLines();
	});

	it('allows a single line to span over 2 stream chunks', () => {
		var emitter = new LineEmitter();
		emitter.on('line', (line: ILine) => {
			expect(line.text).to.eq('foobar');
		});
		emitter.pushLines('foo');
		emitter.pushLines('bar');
		emitter.flushLines();
	});

});

function getJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}
