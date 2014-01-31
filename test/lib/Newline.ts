import sinonChai = require('../sinon-chai');
var expect = sinonChai.expect;
import linez = require('../../lib/api');
import Newline = require('../../lib/Newline');


// ReSharper disable WrongExpressionStatement
describe('Newline', () => {

	it('detects line feed newline character', () => {
		var nl = new Newline('\n');
		expect(nl.name).to.equal('lf');
	});

	it('detects carriage return, line feed newline character sequence', () => {
		var nl = new Newline('\r\n');
		expect(nl.name).to.equal('crlf');
	});

	it('detects carriage return newline character', () => {
		var nl = new Newline('\r');
		expect(nl.name).to.equal('cr');
	});

	it('detects vertical tab newline character', () => {
		var nl = new Newline('\u000B');
		expect(nl.name).to.equal('vt');
	});

	it('detects form feed newline character', () => {
		var nl = new Newline('\u000C');
		expect(nl.name).to.equal('ff');
	});

	it('detects next line newline character', () => {
		var nl = new Newline('\u0085');
		expect(nl.name).to.equal('nel');
	});

	it('detects line separator newline character', () => {
		var nl = new Newline('\u2028');
		expect(nl.name).to.equal('ls');
	});

	it('detects paragraph separator newline character', () => {
		var nl = new Newline('\u2029');
		expect(nl.name).to.equal('ps');
	});

	it('assigns the appropriate newline character upon changing the name', () => {
		var nl = new Newline('\r\n');
		expect(nl.name).to.equal('crlf');
		nl.name = 'lf';
		expect(nl.name).to.equal('lf');
		expect(nl.toString()).to.equal('\n');
	});

	it('throws an error on invalid or unsupported newline character', () => {
		var fn = () => {
			new Newline('foo');
		};
		expect(fn).to.throw(Error, 'Invalid or unsupported newline character');
	});
});
