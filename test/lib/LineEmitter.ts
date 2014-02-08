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
		var stream = fs.createReadStream('test/fixtures/lines.txt');
		var emitter = new LineEmitter(stream);
		var lines = [];
		emitter.on('line', (line: ILine) => {
			lines.push(line);
		});
		emitter.on('end', () => {
			var expectedLines = getJSON('test/fixtures/lines.json');
			expect(lines).to.deep.equal(expectedLines);
			done();
		});
		stream.resume();
	});

	it('supports a string as input', done => {
		var emitter = new LineEmitter('foo');
		var fn = sinon.spy();
		emitter.on('line', fn);
		emitter.on('end', () => {
			expect(fn).to.have.been.calledOnce;
			done();
		});
	});

	it('emits correct number of lines', done => {
		var emitter = new LineEmitter('foo\nbar\r\nbaz\n');
		var fn = sinon.spy();
		emitter.on('line', fn);
		emitter.on('end', () => {
			expect(fn).to.have.been.calledThrice;
			done();
		});
	});

	it('emits the correct line number for each line', done => {
		var emitter = new LineEmitter('foo\nbar\nbaz');
		var expectedLineNumbers = [1, 2, 3];
		emitter.on('line', (line: ILine) => {
			expect(line.number).to.eq(expectedLineNumbers.shift());
		});
		emitter.on('end', done);
	});

	it('emits the correct offset for each line', done => {
		var emitter = new LineEmitter('foo\nbar\nbaz');
		var expectedOffsets = [0, 4, 8];
		emitter.on('line', (line: ILine) => {
			expect(line.offset).to.eq(expectedOffsets.shift());
		});
		emitter.on('end', done);
	});

	it('emits the correct text for each line', done => {
		var emitter = new LineEmitter('foo\nbar\nbaz');
		var expectedTexts = ['foo', 'bar', 'baz'];
		emitter.on('line', (line: ILine) => {
			expect(line.text).to.eq(expectedTexts.shift());
		});
		emitter.on('end', done);
	});

	it('emits the correct newline for each line', done => {
		var emitter = new LineEmitter('foo\nbar\r\nbaz');
		var expectedNewlines = ['\n', '\r\n'];
		emitter.on('line', (line: ILine) => {
			expect(line.newline).to.eq(expectedNewlines.shift());
		});
		emitter.on('end', done);
	});

	it('supports custom newline sequences', done => {
		var emitter = new LineEmitter('foo\n\tbar\r\n|baz{.qux*+', ['*+', '{.', '|', '\t']);
		var expectedTexts = ['foo\n', 'bar\r\n', 'baz', 'qux'];
		var expectedNewlines = ['\t', '|', '{.', '*+'];
		emitter.on('line', (line: ILine) => {
			expect(line.text).to.eq(expectedTexts.shift());
			expect(line.newline).to.eq(expectedNewlines.shift());
		});;
		emitter.on('end', done);
	});

	it('allows a single line to span over 2 stream chunks', done => {
		var ee = new events.EventEmitter();
		var emitter = new LineEmitter(ee);
		emitter.on('line', (line: ILine) => {
			console.log('line:', line);
			expect(line.text).to.eq('foobar');
		});
		emitter.on('end', done);
		ee.emit('data', 'foo');
		ee.emit('data', 'bar');
		ee.emit('end');
	});

});

function getJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}
