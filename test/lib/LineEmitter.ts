import fs = require('fs');
import sinon = require('sinon');
import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import ILine = require('../../lib/ILine');
import LineEmitter = require('../../lib/LineEmitter');
import stream = require('stream');
import RegExpNewlineFinder = require('../../lib/RegExpNewlineFinder');


// ReSharper disable WrongExpressionStatement
describe('LineEmitter', () => {

	it('supports a stream as input', done => {
		var lines = [];
		var emitter = new LineEmitter(new RegExpNewlineFinder(/(\r?\n)/g));
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

	it('emits the correct ILine data for each line', () => {
		var emitter = new LineEmitter(new RegExpNewlineFinder(/(\r?\n)/g));
		var expectedLineNumbers = [1, 2, 3];
		var expectedOffsets = [0, 4, 9];
		var expectedTexts = ['foo', 'bar', 'baz'];
		var expectedNewlines = ['\n', '\r\n'];
		var lines = [];
		emitter.on('line', (line: ILine) => {
			lines.push(line);
			expect(line.number).to.eq(expectedLineNumbers.shift());
			expect(line.offset).to.eq(expectedOffsets.shift());
			expect(line.text).to.eq(expectedTexts.shift());
			expect(line.newline).to.eq(expectedNewlines.shift());
		});
		emitter.pushLines('fo');
		emitter.pushLines('o\n');
		emitter.pushLines('bar\r');
		emitter.pushLines('\nba')
		emitter.pushLines('z');
		emitter.flushLines();
		expect(lines.length).to.eq(3);
	});

});

function getJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}
