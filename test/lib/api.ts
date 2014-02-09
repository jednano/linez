import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import linez = require('../../lib/api');
import Line = require('../../lib/Line');
import newlines = require('../../lib/newlines');
import Newline = require('../../lib/Newline');
import charsets = require('../../lib/charsets');
import ILine = require('../../lib/ILine');
import fs = require('fs');


// ReSharper disable WrongExpressionStatement
describe('linez', () => {

	it('parseFile method parses files', done => {
		var lines: ILine[] = [];
		linez.configure({ encoding: 'utf8' });
		var emitter = linez.parseFile('test/fixtures/lines.txt');
		emitter.on('line', (err: Error, line: ILine) => {
			lines.push(line);
		});
		emitter.on('end', () => {
			var expectedLines = getJSON('test/fixtures/lines.json');
			expect(lines).to.deep.equal(expectedLines);
			done();
		});
	});

	it('parseText method parses text', () => {
		var lines: ILine[] = [];
		linez.parseText('foo\nbar', (err: Error, line: ILine) => {
			lines.push(line);
		});
		expect(lines).to.deep.equal([
			{
				number: 1,
				text: 'foo',
				newline: '\n',
				offset: 0
			},
			{
				number: 2,
				text: 'bar',
				newline: '',
				offset: 4
			}
		]);
	});

});

function getJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}
