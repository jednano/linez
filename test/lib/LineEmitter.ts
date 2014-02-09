﻿import fs = require('fs');
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

	var lines = [];

	before(() => {
		var emitter = new LineEmitter(new RegExpNewlineFinder(/(\r?\n)/g));
		emitter.on('line', (line: ILine) => {
			lines.push(line);
		});
		emitter.pushLines('fo');
		emitter.pushLines('o\n');
		emitter.pushLines('bar\r');
		emitter.pushLines('\nba')
		emitter.pushLines('z');
		emitter.flushLines();
	});

	it('emits correct number of lines', () => {
		expect(lines.length).to.eq(3);
	});

	it('emits the correct line number for each line', () => {
		var expected = [1, 2, 3];
		var actual = getPropertiesFromLines('number');
		expect(actual).to.eql(expected);
	});

	it('emits the correct offset for each line', () => {
		var expected = [0, 4, 9];
		var actual = getPropertiesFromLines('offset');
		expect(actual).to.eql(expected);
	});

	it('emits the correct text for each line', () => {
		var expected = ['foo', 'bar', 'baz'];
		var actual = getPropertiesFromLines('text');
		expect(actual).to.eql(expected);
	});

	it('emits the correct newline for each line', () => {
		var expected = ['\n', '\r\n', undefined];
		var actual = getPropertiesFromLines('newline');
		console.log(actual[2]);
		expect(actual).to.eql(expected);
	});

	function getPropertiesFromLines(propertyName: string) {
		return lines.map((line: ILine) => {
			return line[propertyName];
		});
	}

});

function getJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}
